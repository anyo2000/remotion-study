"""
YRC Wine Talk 티저 — 카드별 완급(배속) 처리 + 최종 타임스탬프

절차:
1. 원본(wine-talk-teaser.raw.wav)을 Whisper로 분석해 카드 경계 탐지
2. 카드별로 잘라 ffmpeg atempo 적용 (01:1.1 / 02:1.0 / 03~05:1.2 / 06:0.9 / 07:1.1)
3. 카드 사이 0.7초 무음 넣어 재조립 → wine-talk-teaser.wav
4. 최종본 Whisper 재실행 → .timestamps.json + .words.json (BEATS 원천)

사용법:
  source .venv/bin/activate
  python scripts/process-wine-talk-tempo.py
"""

import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

from openai import OpenAI

ROOT = Path(__file__).parent.parent
AUDIO_DIR = ROOT / "public" / "audio"
RAW = AUDIO_DIR / "wine-talk-teaser.raw.wav"
FINAL = AUDIO_DIR / "wine-talk-teaser.wav"
FPS = 30
GAP_SEC = 0.3  # 카드 사이 삽입 쉼 (경계 트리밍과 합쳐 총 ~0.8초)
TAIL_SEC = 3.0  # 마지막 멘트 후 여유 (급하게 끊기는 느낌 방지)
EDGE_HEAD = 0.15  # 카드 시작: 첫 단어 앞 여유
EDGE_TAIL = 0.35  # 카드 끝: 마지막 단어 뒤 여유
LAST_TAIL = 1.2  # 마지막 카드: 잔향 살리기

# 카드별 배속 + 다음 카드 시작 앵커 단어(전사 변형 대비 복수 후보)
CARDS = [
    {"name": "CARD00_title", "tempo": 1.1},
    # "와인톡"과 구분 위해 exact 매칭 (구두점 제거 후 단어 일치)
    {"name": "CARD01_intro", "tempo": 1.15, "anchors": ["와인"], "exact": True},
    {"name": "CARD02_champagne", "tempo": 1.05, "anchors": ["1번", "일번", "하얏트", "하야트"]},
    {"name": "CARD03_sauvignon", "tempo": 1.25, "anchors": ["2번", "이번", "여름"]},
    {"name": "CARD04_oregon", "tempo": 1.25, "anchors": ["3번", "삼번", "레드"]},
    {"name": "CARD05_sicilia", "tempo": 1.25, "anchors": ["4번", "사번", "화이트"]},
    {"name": "CARD06_hostpick", "tempo": 0.95, "anchors": ["5번", "오번", "호스트"]},
    {"name": "CARD07_closing", "tempo": 1.15, "anchors": ["다섯", "5잔", "싹"]},
]

# --- API 키 로드 ---
env_path = ROOT / ".env"
API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY and env_path.exists():
    for line in env_path.read_text().splitlines():
        if line.startswith("OPENAI_API_KEY="):
            API_KEY = line.split("=", 1)[1].strip().strip('"').strip("'")
            break
if not API_KEY:
    print("OPENAI_API_KEY 없음")
    sys.exit(1)

client = OpenAI(api_key=API_KEY)


def whisper(path):
    print(f"🎙️ Whisper 분석: {path.name}")
    with open(path, "rb") as f:
        t = client.audio.transcriptions.create(
            file=f,
            model="whisper-1",
            response_format="verbose_json",
            timestamp_granularities=["word", "segment"],
            language="ko",
        )
    segments = [{"start": s.start, "end": s.end, "text": s.text} for s in t.segments]
    words = [{"start": w.start, "end": w.end, "word": w.word} for w in (t.words or [])]
    return segments, words


def find_boundaries(words):
    """앵커 단어로 카드 시작 시각 탐지. 반환: 각 카드의 (시작단어 idx)"""
    idxs = [0]
    search_from = 1
    for card in CARDS[1:]:
        found = None
        for i in range(search_from, len(words)):
            w = words[i]["word"].strip().strip(".,!?…~'\"")
            if card.get("exact"):
                hit = any(w == a for a in card["anchors"])
            else:
                hit = any(a in w for a in card["anchors"])
            if hit:
                found = i
                break
        if found is None:
            print(f"❌ 앵커 못 찾음: {card['name']} {card['anchors']}")
            sys.exit(1)
        idxs.append(found)
        search_from = found + 1
    return idxs


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("ffmpeg 실패:", " ".join(cmd))
        print(r.stderr[-800:])
        sys.exit(1)


def main():
    if not RAW.exists():
        print(f"원본 없음: {RAW} — 먼저 generate-wine-talk-tts.py 실행")
        sys.exit(1)

    segments, words = whisper(RAW)
    idxs = find_boundaries(words)

    # 카드별 (start, end) — 단어 기준 타이트 트리밍
    # (중간점 방식은 TTS의 문단 쉼을 통째로 살려서 쉼이 테이크마다 들쭉날쭉해짐)
    n = len(words)
    spans = []
    prev_end = 0.0
    for c, i in enumerate(idxs):
        start = 0.0 if c == 0 else max(words[i]["start"] - EDGE_HEAD, prev_end)
        if c + 1 < len(idxs):
            j = idxs[c + 1]
            end = min(words[j - 1]["end"] + EDGE_TAIL, words[j]["start"])
        else:
            end = words[n - 1]["end"] + LAST_TAIL
        prev_end = end
        spans.append((start, end))
        print(
            f"  {CARDS[c]['name']}: {start:6.2f}s ~ {end:6.2f}s "
            f"(x{CARDS[c]['tempo']}) | 첫 단어: {words[i]['word']}"
        )

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        silence = td / "gap.wav"
        run([
            "ffmpeg", "-y", "-f", "lavfi",
            "-i", "anullsrc=r=24000:cl=mono",
            "-t", str(GAP_SEC), "-c:a", "pcm_s16le", str(silence),
        ])

        pieces = []
        for c, (start, end) in enumerate(spans):
            cut = td / f"c{c}.wav"
            run([
                "ffmpeg", "-y", "-i", str(RAW),
                "-ss", f"{start:.3f}", "-to", f"{end:.3f}",
                "-c:a", "pcm_s16le", str(cut),
            ])
            tempo = CARDS[c]["tempo"]
            out = td / f"c{c}t.wav"
            # 배속 + 경계 페이드 — 스플라이스 어색함 제거
            # 마지막 카드는 잔향을 길고 부드럽게 (0.4초), 나머지는 0.12초
            is_last = c == len(spans) - 1
            fade_d = 0.4 if is_last else 0.12
            scaled_dur = (end - start) / tempo
            fade_out_st = max(0.0, scaled_dur - fade_d)
            run([
                "ffmpeg", "-y", "-i", str(cut),
                "-filter:a",
                f"atempo={tempo},afade=t=in:st=0:d=0.03,"
                f"afade=t=out:st={fade_out_st:.3f}:d={fade_d}",
                "-c:a", "pcm_s16le", str(out),
            ])
            if c > 0:
                pieces.append(silence)
            pieces.append(out)

        # 끝 여유 3초
        tail = td / "tail.wav"
        run([
            "ffmpeg", "-y", "-f", "lavfi",
            "-i", "anullsrc=r=24000:cl=mono",
            "-t", str(TAIL_SEC), "-c:a", "pcm_s16le", str(tail),
        ])
        pieces.append(tail)

        concat_list = td / "list.txt"
        concat_list.write_text("\n".join(f"file '{p}'" for p in pieces))
        run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", str(concat_list), "-c:a", "pcm_s16le", str(FINAL),
        ])

    # 최종본 재분석 → 타임스탬프 저장
    segments, words = whisper(FINAL)
    dur = words[-1]["end"] if words else 0

    ts_path = FINAL.with_suffix(".timestamps.json")
    ts_path.write_text(
        json.dumps(
            {"file": str(FINAL), "segments": segments, "words": words},
            ensure_ascii=False,
            indent=2,
        )
    )
    words_path = AUDIO_DIR / "wine-talk-teaser.words.json"
    words_path.write_text(
        json.dumps(
            {"segments": segments, "words": words}, ensure_ascii=False, indent=2
        )
    )

    print(f"\n✅ 완료 — 최종 길이 {dur:.1f}초 ({round(dur*FPS)}프레임)")
    print(f"  음성: {FINAL}")
    print(f"  타임스탬프(문장): {ts_path}")
    print(f"  타임스탬프(단어): {words_path} — {len(words)}단어")
    # 장면 경계 — 원본 span을 배속·쉼으로 환산 (결정적 계산, 재전사 불필요)
    print("\n장면(카드) 시작 프레임:")
    scenes = []
    t = 0.0
    for c, (start, end) in enumerate(spans):
        if c > 0:
            t += GAP_SEC
        scaled = (end - start) / CARDS[c]["tempo"]
        scenes.append({
            "name": CARDS[c]["name"],
            "tempo": CARDS[c]["tempo"],
            "start": round(t, 3),
            "end": round(t + scaled, 3),
            "startFrame": round(t * FPS),
            "endFrame": round((t + scaled) * FPS),
        })
        print(f"  {CARDS[c]['name']}: {t:.2f}s (fr {round(t*FPS)}) x{CARDS[c]['tempo']}")
        t += scaled

    scenes_path = AUDIO_DIR / "wine-talk-teaser.scenes.json"
    scenes_path.write_text(json.dumps(scenes, ensure_ascii=False, indent=2))
    print(f"  장면 경계 저장: {scenes_path}")


if __name__ == "__main__":
    main()
