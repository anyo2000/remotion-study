"""
Whisper API로 음성 파일에서 단어별 타임스탬프 추출
→ 장면 전환 키워드의 정확한 시작 시점을 알아내서 프레임으로 변환

사용법:
  source .venv/bin/activate
  python scripts/extract-timestamps.py
  python scripts/extract-timestamps.py --file public/audio/counsel-fp.wav
"""

import os
import sys
import json
import argparse
from pathlib import Path

from openai import OpenAI

# --- API 키 로드 ---
env_path = Path(__file__).parent.parent / ".env"
API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY and env_path.exists():
    for line in env_path.read_text().splitlines():
        if line.startswith("OPENAI_API_KEY="):
            API_KEY = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

if not API_KEY:
    print("OPENAI_API_KEY 없음")
    sys.exit(1)

FPS = 30


def extract_timestamps(audio_path: str):
    client = OpenAI(api_key=API_KEY)

    print(f"🎙️ Whisper 분석 중: {audio_path}")

    with open(audio_path, "rb") as f:
        transcription = client.audio.transcriptions.create(
            file=f,
            model="whisper-1",
            response_format="verbose_json",
            timestamp_granularities=["word", "segment"],
            language="ko",
        )

    # 세그먼트 출력
    segments_raw = [{"start": s.start, "end": s.end, "text": s.text} for s in transcription.segments]
    print(f"\n📝 세그먼트 ({len(segments_raw)}개):")
    for seg in segments_raw:
        start_frame = round(seg["start"] * FPS)
        end_frame = round(seg["end"] * FPS)
        print(f"  [{seg['start']:.1f}s~{seg['end']:.1f}s] (fr {start_frame}~{end_frame}) {seg['text']}")

    # 단어별 출력
    words_raw = [{"start": w.start, "end": w.end, "word": w.word} for w in (transcription.words or [])]
    if words_raw:
        print(f"\n🔤 단어별 타임스탬프 ({len(words_raw)}개):")
        for w in words_raw:
            frame = round(w["start"] * FPS)
            print(f"  {w['start']:6.2f}s (fr {frame:4d}) | {w['word']}")

    # JSON 저장
    out_path = Path(audio_path).with_suffix(".timestamps.json")
    result = {
        "file": audio_path,
        "segments": segments_raw,
        "words": words_raw,
    }
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\n💾 저장: {out_path}")

    # 장면 전환 키워드 자동 탐색
    keywords = ["맞아요", "근데", "첫째", "둘째", "보험은"]
    print(f"\n🎬 장면 전환 키워드 탐색:")
    if words_raw:
        for kw in keywords:
            for w in words_raw:
                if kw in w["word"]:
                    frame = round(w["start"] * FPS)
                    print(f"  '{kw}' → {w['start']:.2f}s (프레임 {frame})")
                    break
            else:
                print(f"  '{kw}' → 못 찾음")

    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--file",
        default="public/audio/counsel-fp.wav",
        help="분석할 오디오 파일 경로",
    )
    args = parser.parse_args()
    extract_timestamps(args.file)


if __name__ == "__main__":
    main()
