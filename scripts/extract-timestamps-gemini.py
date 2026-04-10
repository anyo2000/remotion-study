"""
Gemini API로 음성 파일에서 장면별 타임스탬프 추출
→ 각 장면 시작 키워드의 시작 시점을 초 단위로 추출

사용법:
  source .venv/bin/activate
  python scripts/extract-timestamps-gemini.py
  python scripts/extract-timestamps-gemini.py --file public/audio/april-gift-aoede.wav
"""

import os
import sys
import json
import argparse
from pathlib import Path

from google import genai
from google.genai import types

# --- API 키 로드 ---
env_path = Path(__file__).parent.parent / ".env"
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY and env_path.exists():
    for line in env_path.read_text().splitlines():
        if line.startswith("GEMINI_API_KEY="):
            API_KEY = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

if not API_KEY:
    print("GEMINI_API_KEY 없음")
    sys.exit(1)

FPS = 30

# --- 장면별 시작 키워드 (대본 기준) ---
SCENE_KEYWORDS = [
    {"scene": 1, "keyword": "화창한 봄", "label": "도입/선물 예고"},
    {"scene": 2, "keyword": "첫 번째 선물", "label": "간병 한도"},
    {"scene": 3, "keyword": "두 번째 선물", "label": "생활비 한도"},
    {"scene": 4, "keyword": "암만 늘려주면", "label": "순환계"},
    {"scene": 5, "keyword": "그리고 이건 역대급", "label": "고령 생활비"},
    {"scene": 6, "keyword": "올인원이 이렇게 좋으면", "label": "프리미엄올인원"},
    {"scene": 7, "keyword": "유병자 고객님들", "label": "최저보험료"},
    {"scene": 8, "keyword": "어른들만 챙기면", "label": "0540 어린이"},
    {"scene": 9, "keyword": "자, FP님들", "label": "마무리 CTA"},
]


def extract_timestamps(audio_path: str):
    client = genai.Client(api_key=API_KEY)

    print(f"🎙️ Gemini 오디오 분석 중: {audio_path}")

    # 오디오 파일 업로드
    audio_file = client.files.upload(file=audio_path)
    print(f"  파일 업로드 완료: {audio_file.name}")

    # 키워드 목록 생성
    keyword_list = "\n".join(
        [f'  - 장면{s["scene"]}: "{s["keyword"]}" ({s["label"]})' for s in SCENE_KEYWORDS]
    )

    prompt = f"""이 오디오 파일을 듣고, 아래 각 키워드/문장이 시작되는 정확한 시간(초)을 알려주세요.

각 장면의 시작 키워드:
{keyword_list}

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만:
[
  {{"scene": 1, "keyword": "화창한 봄", "start_sec": 0.0}},
  {{"scene": 2, "keyword": "첫 번째 선물", "start_sec": ...}},
  ...
]

주의사항:
- 각 키워드가 실제로 발화되기 시작하는 시점을 초 단위(소수점 1자리)로 알려주세요
- 오디오를 처음부터 끝까지 꼼꼼히 들으며 정확한 시간을 측정해주세요
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            types.Content(
                parts=[
                    types.Part.from_uri(
                        file_uri=audio_file.uri,
                        mime_type=audio_file.mime_type,
                    ),
                    types.Part.from_text(text=prompt),
                ]
            )
        ],
    )

    # JSON 파싱
    raw_text = response.text.strip()
    # ```json ... ``` 감싸기 제거
    if raw_text.startswith("```"):
        raw_text = raw_text.split("\n", 1)[1]
        if raw_text.endswith("```"):
            raw_text = raw_text[: raw_text.rfind("```")]

    timestamps = json.loads(raw_text)

    print(f"\n📍 장면별 타임스탬프:")
    for ts in timestamps:
        frame = round(ts["start_sec"] * FPS)
        label = next(
            (s["label"] for s in SCENE_KEYWORDS if s["scene"] == ts["scene"]),
            "",
        )
        print(
            f"  장면{ts['scene']} [{label}]: {ts['start_sec']:.1f}s (프레임 {frame})"
        )

    # JSON 저장
    out_path = Path(audio_path).with_suffix(".timestamps.json")
    result = {
        "file": audio_path,
        "fps": FPS,
        "scenes": timestamps,
        "scene_frames": {
            f"scene{ts['scene']}": round(ts["start_sec"] * FPS) for ts in timestamps
        },
    }
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\n💾 저장: {out_path}")

    # Remotion용 프레임 배열 출력
    frames = [round(ts["start_sec"] * FPS) for ts in timestamps]
    print(f"\n🎬 Remotion Sequence from 값:")
    print(f"  const SCENE_STARTS = {frames};")

    # 파일 정리
    try:
        client.files.delete(name=audio_file.name)
    except Exception:
        pass

    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--file",
        default="public/audio/april-gift-aoede.wav",
        help="분석할 오디오 파일 경로",
    )
    args = parser.parse_args()
    extract_timestamps(args.file)


if __name__ == "__main__":
    main()
