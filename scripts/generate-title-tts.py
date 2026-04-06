"""
제목 나레이션 TTS — Zephyr (중성, 깔끔)
"""
import os
import sys
import wave
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

if not API_KEY:
    print("GEMINI_API_KEY 없음")
    sys.exit(1)

MODEL = "gemini-2.5-pro-preview-tts"
OUT_DIR = Path(__file__).parent.parent / "public" / "audio"

STYLE = """차분하고 또렷한 나레이터. 교육 영상 제목 안내.
천천히, 한 글자 한 글자 또박또박.
---
"""
TEXT = "망설이는 고객, 설득하는 화법"

def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)

def main():
    client = genai.Client(api_key=API_KEY)
    content = f"{STYLE}\n{TEXT}"
    print(f"🎙️ 제목 TTS 생성 (Zephyr)")

    response = client.models.generate_content(
        model=MODEL,
        contents=content,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Zephyr")
                )
            ),
        ),
    )

    audio_part = response.candidates[0].content.parts[0]
    pcm_data = audio_part.inline_data.data
    mime = audio_part.inline_data.mime_type

    sample_rate = 24000
    if "rate=" in mime:
        try:
            sample_rate = int(mime.split("rate=")[1].split(";")[0])
        except (ValueError, IndexError):
            pass

    duration = len(pcm_data) / (sample_rate * 2)
    filepath = OUT_DIR / "counsel-title.wav"
    save_wav(pcm_data, filepath, sample_rate)
    print(f"✅ 저장: {filepath.name} ({duration:.1f}초)")

if __name__ == "__main__":
    main()
