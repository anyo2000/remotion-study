"""
왜 후킹인가 — Gemini로 타임스탬프 추출 (V2 대본 확정판)

사용법:
  source .venv/bin/activate
  python scripts/extract-hooking-why-timestamps.py
"""

import os
import sys
import json
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
AUDIO_PATH = "public/audio/link-edu-hooking-why.wav"

# --- 장면별 시작 키워드 ---
SCENE_KEYWORDS = [
    {"scene": 1, "keyword": "의사가 귓구멍을 파라고 할까요", "label": "반전 — 오프닝 질문"},
    {"scene": 2, "keyword": "지금 무슨소리인가 싶으시죠", "label": "키워드 — 후킹의 결과"},
    {"scene": 3, "keyword": "서울 지하철에서", "label": "지하철 스토리"},
    {"scene": 4, "keyword": "근데 한 아저씨가", "label": "아저씨 질문"},
    {"scene": 5, "keyword": "아무도 대답은 안 했어요", "label": "다들 쳐다봄"},
    {"scene": 6, "keyword": "왜 쳐다봤을까요", "label": "답을 안 알려줌"},
    {"scene": 7, "keyword": "드라마 애매한 데서", "label": "드라마 비유"},
    {"scene": 8, "keyword": "홈쇼핑도 마찬가지예요", "label": "홈쇼핑 비교"},
    {"scene": 9, "keyword": "우리가 하는 상담도", "label": "3초"},
    {"scene": 10, "keyword": "똑같은 FP", "label": "대화 비교 시작"},
    {"scene": 11, "keyword": "고객님, 임신해도", "label": "After 질문"},
    {"scene": 12, "keyword": "첫마디 하나 바꿨을 뿐", "label": "핵심 메시지"},
    {"scene": 13, "keyword": "그러니까 우리 FP님들은", "label": "클로징"},
    {"scene": 14, "keyword": "다음 시간엔", "label": "CTA"},
]


def main():
    client = genai.Client(api_key=API_KEY)

    print(f"🎙️ Gemini 오디오 분석 중: {AUDIO_PATH}")

    audio_file = client.files.upload(file=AUDIO_PATH)
    print(f"  파일 업로드 완료: {audio_file.name}")

    keyword_list = "\n".join(
        [f'  - 장면{s["scene"]}: "{s["keyword"]}" ({s["label"]})' for s in SCENE_KEYWORDS]
    )

    prompt = f"""이 오디오 파일을 듣고, 아래 각 키워드/문장이 시작되는 정확한 시간(초)을 알려주세요.

참고: 오디오 시작 후 약 1~2초간 묵음이 있을 수 있고, 그 후 내레이션이 시작됩니다.

각 장면의 시작 키워드:
{keyword_list}

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만:
[
  {{"scene": 1, "keyword": "의사가 귓구멍을 파라고 할까요", "start_sec": 0.0}},
  {{"scene": 2, "keyword": "지금 무슨소리인가 싶으시죠", "start_sec": ...}},
  ...
]

주의사항:
- 각 키워드가 실제로 발화되기 시작하는 시점을 초 단위(소수점 1자리)로 알려주세요
- 오디오를 처음부터 끝까지 꼼꼼히 들으며 정확한 시간을 측정해주세요
"""

    response = client.models.generate_content(
        model="gemini-2.5-pro",
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

    raw_text = response.text.strip()
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
    out_path = Path(AUDIO_PATH).with_suffix(".timestamps.json")
    result = [
        {"keyword": ts["keyword"], "start_sec": ts["start_sec"]}
        for ts in timestamps
    ]
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(f"\n💾 저장: {out_path}")

    # Remotion용 프레임
    frames = [round(ts["start_sec"] * FPS) for ts in timestamps]
    print(f"\n🎬 Remotion Sequence from 값:")
    print(f"  const SCENE_STARTS = {frames};")

    try:
        client.files.delete(name=audio_file.name)
    except Exception:
        pass


if __name__ == "__main__":
    main()
