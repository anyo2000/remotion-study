"""
장면 1, 2 내부의 키워드별 세부 타임스탬프 추출
"""
import os, sys, json
from pathlib import Path
from google import genai
from google.genai import types

env_path = Path(__file__).parent.parent / ".env"
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY and env_path.exists():
    for line in env_path.read_text().splitlines():
        if line.startswith("GEMINI_API_KEY="):
            API_KEY = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

client = genai.Client(api_key=API_KEY)
audio_file = client.files.upload(file="public/audio/april-gift-aoede.wav")

prompt = """이 오디오를 처음부터 끝까지 듣고, 아래 각 단어/문장이 **시작되는 정확한 시간(초)**을 알려주세요.

장면1 (0초~20초 구간):
- "화창한 봄" (첫 단어)
- "4월입니다"
- "특별한 선물 보따리를 준비했습니다"
- "4월 한정"
- "인수 조건 대폭 확대"
- "지금 바로 뜯어보시죠"

장면2 (20초~39초 구간):
- "첫 번째 선물"
- "간병인 입원 생활비"
- "프리미엄 플랜에서만"
- "20만 원이 가능"
- "올인원 플랜도"
- "20만 원 꽉꽉"
- "강력한 힘이 될 겁니다"

반드시 JSON 배열로만 응답. 다른 텍스트 없이:
[
  {"keyword": "화창한 봄", "start_sec": 0.0},
  {"keyword": "4월입니다", "start_sec": ...},
  ...
]
"""

response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents=[
        types.Content(parts=[
            types.Part.from_uri(file_uri=audio_file.uri, mime_type=audio_file.mime_type),
            types.Part.from_text(text=prompt),
        ])
    ],
)

raw = response.text.strip()
if raw.startswith("```"):
    raw = raw.split("\n", 1)[1]
    if raw.endswith("```"):
        raw = raw[:raw.rfind("```")]

data = json.loads(raw)
FPS = 30

print("\n📍 세부 타임스탬프:")
for d in data:
    fr = round(d["start_sec"] * FPS)
    print(f'  "{d["keyword"]}": {d["start_sec"]:.1f}s (프레임 {fr})')

out = Path("public/audio/april-gift-aoede.detail-timestamps.json")
out.write_text(json.dumps(data, ensure_ascii=False, indent=2))
print(f"\n💾 {out}")

try:
    client.files.delete(name=audio_file.name)
except Exception:
    pass
