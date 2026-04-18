"""
scene-spec.json + words.json + timestamps.json → beats.ts 자동 생성

사용법:
  python scripts/generate-beats.py <에피소드명>

예시:
  python scripts/generate-beats.py hooking-why

필요 파일:
  src/<폴더>/hooking-why-spec.json     ← 씬 설계 (사용자가 작성)
  public/audio/<에피소드>.words.json    ← Whisper 단어 타임스탬프
  public/audio/<에피소드>.timestamps.json ← Gemini 씬 시작 타임스탬프

출력:
  src/<폴더>/<에피소드>-beats.ts        ← 자동 생성
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import List, Optional


# ── 설정 ──

FPS = 30
TITLE_DUR = 120  # 타이틀 카드 프레임


def load_json(path: Path) -> any:
    return json.loads(path.read_text(encoding="utf-8"))


# ── 단어 검색 ──

def flatten_words(words_data: List[dict]) -> List[dict]:
    """words.json의 중첩 구조를 평탄화 → [{word, start, end}, ...]"""
    flat = []
    for segment in words_data:
        for w in segment.get("words", []):
            flat.append({
                "word": w["word"].rstrip("?.!,"),
                "word_raw": w["word"],
                "start": w["start"],
                "end": w["end"],
            })
    return flat


def find_word(flat_words: List[dict], match: str, after_sec: float = 0.0) -> Optional[dict]:
    """
    flat_words에서 match 키워드를 찾는다.
    after_sec 이후에 나오는 첫 매칭을 반환 (동일 단어 중복 시 구분용).

    매칭 우선순위:
    1. 정확히 일치 (구두점 제거 후)
    2. 포함 (match가 word 안에 포함)
    """
    match_clean = match.rstrip("?.!,")

    # 1차: 정확 매칭
    for w in flat_words:
        if w["start"] >= after_sec and w["word"] == match_clean:
            return w

    # 2차: 포함 매칭
    for w in flat_words:
        if w["start"] >= after_sec and match_clean in w["word"]:
            return w

    # 3차: 역포함 (짧은 검색어가 긴 단어에 포함)
    for w in flat_words:
        if w["start"] >= after_sec and w["word"] in match_clean:
            return w

    return None


# ── beats.ts 생성 ──

def generate_beats_ts(spec: List[dict], flat_words: List[dict], timestamps: List[dict]) -> str:
    """scene-spec → beats.ts 문자열"""

    # timestamps.json에서 씬 시작 초 매핑
    ts_map = {}
    for ts in timestamps:
        ts_map[ts["keyword"]] = ts["start_sec"]

    lines = []
    lines.append('/**')
    lines.append(' * 자동 생성된 BEATS 타이밍 데이터')
    lines.append(' * ')
    lines.append(' * 생성: python scripts/generate-beats.py')
    lines.append(' * 원천: words.json (Whisper) + timestamps.json (Gemini) + spec.json (설계)')
    lines.append(' * 규칙: 음성보다 먼저 정보 노출 금지 (±3프레임 이내)')
    lines.append(' */')
    lines.append('')
    lines.append('// ── 타이밍 기준 ──')
    lines.append(f'export const FPS = {FPS};')
    lines.append(f'export const TITLE_DUR = {TITLE_DUR};')
    lines.append(f'export const AUDIO_START = TITLE_DUR;')
    lines.append('')
    lines.append('/** 오디오 초 → 글로벌 프레임 */')
    lines.append('export const T = (sec: number) => Math.round(sec * FPS) + AUDIO_START;')
    lines.append('')

    # SCENE_STARTS
    lines.append('// ── 씬 시작 (오디오 초 기준) ──')
    lines.append('export const SCENE_STARTS = {')
    for scene in spec:
        name_lower = scene["name"].lower()
        kw = scene["scene_keyword"]
        sec = ts_map.get(kw)
        if sec is None:
            # 부분 매칭 시도
            for tk, tv in ts_map.items():
                if kw in tk or tk in kw:
                    sec = tv
                    break
        if sec is None:
            sec = 0.0
            lines.append(f'  {name_lower}: {sec}, // ⚠️ 타임스탬프 미발견: "{kw}"')
        else:
            lines.append(f'  {name_lower}: {sec}, // "{kw}"')
    lines.append('} as const;')
    lines.append('')

    # 각 씬의 BEATS
    not_found = []

    for scene in spec:
        name = scene["name"]
        kw = scene["scene_keyword"]
        label = scene.get("label", "")
        beats = scene.get("beats", {})

        # 씬 시작 초
        scene_sec = ts_map.get(kw, 0.0)
        if scene_sec is None:
            for tk, tv in ts_map.items():
                if kw in tk or tk in kw:
                    scene_sec = tv
                    break
            if scene_sec is None:
                scene_sec = 0.0

        lines.append(f'// {"━" * 50}')
        if label:
            lines.append(f'// {name}: {label}')
        lines.append(f'// 오디오 {scene_sec}s~')
        lines.append(f'// {"━" * 50}')

        if scene_sec > 0:
            lines.append(f'const S_{name} = {scene_sec};')

        lines.append(f'export const BEATS_{name} = {{')

        for beat_key, beat_val in beats.items():
            if beat_val["type"] == "fixed":
                frame = beat_val["frame"]
                lines.append(f'  {beat_key}: {frame},')

            elif beat_val["type"] == "word":
                match_word = beat_val["match"]
                after = beat_val.get("after_sec", scene_sec)
                found = find_word(flat_words, match_word, after_sec=after)

                if found:
                    local_frame = round((found["start"] - scene_sec) * FPS)
                    local_frame = max(0, local_frame)
                    comment = f'// "{found["word_raw"]}" {found["start"]:.2f}s'
                    if scene_sec > 0:
                        lines.append(f'  {beat_key}: {local_frame}, {comment}')
                    else:
                        lines.append(f'  {beat_key}: {local_frame}, {comment}')
                else:
                    not_found.append(f'{name}.{beat_key}: "{match_word}" (after {after}s)')
                    lines.append(f'  {beat_key}: 0, // ⚠️ 미발견: "{match_word}"')

        lines.append('} as const;')
        lines.append('')

    # 미발견 경고
    if not_found:
        print(f"\n⚠️  매칭 실패 {len(not_found)}건:")
        for nf in not_found:
            print(f"  - {nf}")
        print("  → words.json에서 실제 단어를 확인하고 spec의 match 값을 수정하세요")

    return "\n".join(lines)


# ── 메인 ──

def main():
    if len(sys.argv) < 2:
        print("사용법: python scripts/generate-beats.py <에피소드명>")
        print("예시:   python scripts/generate-beats.py hooking-why")
        sys.exit(1)

    episode = sys.argv[1]
    root = Path(__file__).parent.parent

    # 파일 찾기
    audio_prefix = f"link-edu-{episode}"
    words_path = root / f"public/audio/{audio_prefix}.words.json"
    ts_path = root / f"public/audio/{audio_prefix}.timestamps.json"

    # spec 파일 찾기 (src/ 하위 어딘가)
    spec_candidates = list(root.glob(f"src/**/{episode}-spec.json"))
    if not spec_candidates:
        print(f"❌ spec 파일을 찾을 수 없음: src/**/{episode}-spec.json")
        print(f"   먼저 씬 설계 spec을 작성하세요")
        sys.exit(1)
    spec_path = spec_candidates[0]

    # 출력 경로 (spec과 같은 폴더)
    out_path = spec_path.parent / f"{episode}-beats.ts"

    # 파일 존재 확인
    for p, label in [(words_path, "words.json"), (ts_path, "timestamps.json")]:
        if not p.exists():
            print(f"❌ {label} 없음: {p}")
            sys.exit(1)

    print(f"📂 spec:       {spec_path.relative_to(root)}")
    print(f"📂 words:      {words_path.relative_to(root)}")
    print(f"📂 timestamps: {ts_path.relative_to(root)}")
    print(f"📂 출력:       {out_path.relative_to(root)}")

    # 로드
    spec = load_json(spec_path)
    words_data = load_json(words_path)
    timestamps = load_json(ts_path)
    flat_words = flatten_words(words_data)

    print(f"\n📊 단어 총 {len(flat_words)}개, 씬 {len(spec)}개")

    # 생성
    result = generate_beats_ts(spec, flat_words, timestamps)

    # 저장
    out_path.write_text(result, encoding="utf-8")
    print(f"\n✅ 생성 완료: {out_path.relative_to(root)}")

    # 검증: 기존 beats.ts와 비교
    existing = spec_path.parent / f"{episode}-beats.ts"
    if existing.exists() and existing != out_path:
        print(f"\n📋 기존 파일과 비교하려면:")
        print(f"   diff {existing.relative_to(root)} {out_path.relative_to(root)}")


if __name__ == "__main__":
    main()
