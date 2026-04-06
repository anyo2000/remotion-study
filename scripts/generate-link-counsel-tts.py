"""
링크컨설팅 — 망설이는 고객 설득 화법
남자 고객(Charon) + 여자 FP(Leda) 각각 TTS 생성

사용법:
  source .venv/bin/activate
  python scripts/generate-link-counsel-tts.py
"""

import os
import sys
import wave
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

MODEL = "gemini-2.5-pro-preview-tts"
OUT_DIR = Path(__file__).parent.parent / "public" / "audio"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# --- 대사 정의 ---
LINES = [
    {
        "id": "counsel-customer",
        "voice": "Charon",
        "style": """30대 남성 고객. 관심은 있지만 결정을 미루는 톤.
약간 망설이면서, 솔직하게 말하는 느낌. 자연스러운 대화체.
---
""",
        "text": "좋은건 알겠는데, 솔직히 좀 고민되네요. 다음에 할까 싶기도 하고요.",
    },
    {
        "id": "counsel-fp",
        "voice": "Leda",
        "style": """차분하고 따뜻한 여성 FP. 억지로 권하지 않으면서도 설득력 있는 톤.
공감하면서 시작하고, 팩트를 전달할 때는 또렷하게.
핵심 포인트에서 살짝 멈추고 강조.
마지막 문장은 확신에 찬 목소리로.
문단 사이에 충분히 쉬어주세요.
---
""",
        "text": """맞아요, 당장 급하지 않으니까요. 저도 억지로 권하고 싶지 않아요. 다음에 하셔도 됩니다.
근데 다음에 하면 딱 두 가지가 달라집니다.
첫째, 고객님은 내일이면 하루 더 나이 드세요.
둘째, 그 사이에 병원 한번이라도 다녀오시거나 건강검진하시면, 이 조건 그대로는 다시 가입 못하실 수 있어요.
보험은 돈으로 사는 게 아니라 건강으로 사는 거예요.
가장 건강하고 저렴한 오늘이, 가장 좋은 조건입니다.""",
    },
]


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def generate_voice(client, line):
    voice = line["voice"]
    content = f"{line['style']}\n{line['text']}"

    print(f"\n🎙️ [{line['id']}] 음성: {voice}")
    print(f"   대사: {line['text'][:50]}...")

    response = client.models.generate_content(
        model=MODEL,
        contents=content,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=voice
                    )
                )
            ),
        ),
    )

    audio_part = response.candidates[0].content.parts[0]
    pcm_data = audio_part.inline_data.data
    mime = audio_part.inline_data.mime_type

    # sample rate 파싱
    sample_rate = 24000
    if "rate=" in mime:
        try:
            sample_rate = int(mime.split("rate=")[1].split(";")[0])
        except (ValueError, IndexError):
            pass

    duration = len(pcm_data) / (sample_rate * 2)
    filepath = OUT_DIR / f"{line['id']}.wav"
    save_wav(pcm_data, filepath, sample_rate)
    print(f"   ✅ 저장: {filepath.name} ({duration:.1f}초)")

    return filepath, duration


def main():
    client = genai.Client(api_key=API_KEY)

    print("=" * 50)
    print("링크컨설팅 — 망설이는 고객 설득 화법 TTS")
    print("=" * 50)

    results = []
    for line in LINES:
        filepath, duration = generate_voice(client, line)
        results.append((line["id"], filepath.name, duration))

    print("\n" + "=" * 50)
    print("📋 결과 요약:")
    for line_id, filename, duration in results:
        print(f"  {line_id}: {filename} ({duration:.1f}초)")
    print("=" * 50)


if __name__ == "__main__":
    main()
