"""
YRC Wine Talk 티저 — 무절단 마감 (스플라이스 없음)

카드별 자르기/배속을 하지 않는다 (경계에서 자음 잘림·어색한 이음새 발생 — 2026-07-05 교훈).
원본을 통째로: 균일 배속 1.08x → 끝 3초 무음 → Whisper 타임스탬프 → 씬 경계(앵커 단어).

사용법:
  .venv/bin/python scripts/finalize-wine-talk-audio.py
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
TEMPO = 1.08  # 전체 균일 — 이음새 없음
TAIL_SEC = 3.0

CARDS = [
    {"name": "CARD00_title"},
    {"name": "CARD01_intro", "anchors": ["와인"], "exact": True},
    {"name": "CARD02_champagne", "anchors": ["1번", "일번", "하얏트", "하야트"]},
    {"name": "CARD03_sauvignon", "anchors": ["2번", "이번", "여름"]},
    {"name": "CARD04_oregon", "anchors": ["3번", "삼번", "레드"]},
    {"name": "CARD05_sicilia", "anchors": ["4번", "사번", "화이트"]},
    {"name": "CARD06_hostpick", "anchors": ["5번", "오번", "호스트"]},
    {"name": "CARD07_closing", "anchors": ["다섯", "5잔", "싹"]},
]

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


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("ffmpeg 실패:", " ".join(cmd))
        print(r.stderr[-800:])
        sys.exit(1)


def find_boundaries(words):
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


def main():
    if not RAW.exists():
        print(f"원본 없음: {RAW} — 먼저 generate-wine-talk-tts.py 실행")
        sys.exit(1)

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        sped = td / "sped.wav"
        run([
            "ffmpeg", "-y", "-i", str(RAW),
            "-filter:a", f"atempo={TEMPO}",
            "-c:a", "pcm_s16le", str(sped),
        ])
        tail = td / "tail.wav"
        run([
            "ffmpeg", "-y", "-f", "lavfi",
            "-i", "anullsrc=r=24000:cl=mono",
            "-t", str(TAIL_SEC), "-c:a", "pcm_s16le", str(tail),
        ])
        lst = td / "list.txt"
        lst.write_text(f"file '{sped}'\nfile '{tail}'")
        run([
            "ffmpeg", "-y", "-f", "concat", "-safe", "0",
            "-i", str(lst), "-c:a", "pcm_s16le", str(FINAL),
        ])

    segments, words = whisper(FINAL)
    dur_frames = None
    p = subprocess.run(
        ["afinfo", str(FINAL)], capture_output=True, text=True
    )
    for line in p.stdout.splitlines():
        if "estimated duration" in line:
            dur_frames = round(float(line.split(":")[1].strip().split()[0]) * FPS)

    ts_path = FINAL.with_suffix(".timestamps.json")
    ts_path.write_text(
        json.dumps({"file": str(FINAL), "segments": segments, "words": words},
                   ensure_ascii=False, indent=2)
    )
    words_path = AUDIO_DIR / "wine-talk-teaser.words.json"
    words_path.write_text(
        json.dumps({"segments": segments, "words": words}, ensure_ascii=False, indent=2)
    )

    # 씬 경계: 앵커 단어 시작과 직전 단어 끝의 중간점 (비주얼 컷 위치용 — 오디오는 안 자름)
    idxs = find_boundaries(words)
    scenes = []
    for c, i in enumerate(idxs):
        if c == 0:
            start = 0.0
        else:
            start = round((words[i - 1]["end"] + words[i]["start"]) / 2, 3)
        scenes.append({
            "name": CARDS[c]["name"],
            "start": start,
            "startFrame": round(start * FPS),
            "anchorWord": words[i]["word"],
            "anchorStart": words[i]["start"],
        })
        print(f"  {CARDS[c]['name']}: 컷 {start:.2f}s (fr {round(start*FPS)}) | 앵커 '{words[i]['word']}' {words[i]['start']:.2f}s")
    scenes_path = AUDIO_DIR / "wine-talk-teaser.scenes.json"
    scenes_path.write_text(json.dumps(scenes, ensure_ascii=False, indent=2))

    print(f"\n✅ 완료 — 최종 {dur_frames}프레임 ({dur_frames/FPS:.1f}초, 배속 {TEMPO} 균일·무절단·끝 {TAIL_SEC}초 여유)")
    print(f"  음성: {FINAL}")
    print(f"  단어: {words_path} — {len(words)}단어")


if __name__ == "__main__":
    main()
