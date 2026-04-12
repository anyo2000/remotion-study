"""
후킹의 원리 — Gemini TTS 음성 생성
전체 대본을 한 번에 보내서 일관된 목소리로 생성

사용법:
  source .venv/bin/activate
  python scripts/generate-hooking-why-tts.py
  python scripts/generate-hooking-why-tts.py --voice Leda
"""

import os
import sys
import wave
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

MODEL = "gemini-2.5-pro-preview-tts"
OUT_DIR = Path(__file__).parent.parent / "public" / "audio"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# --- 스타일 프롬프트 ---
STYLE_PROMPT = """자신감 있고 에너지 있는 교육 강사. 보험 영업 교육 영상 나레이션.
재밌게 이야기하듯이. 핵심 단어에서 살짝 힘주고.
질문을 던질 때는 궁금하게. 답을 말할 때는 확신 있게.
문단 사이에 충분히 쉬어주세요. 자연스러운 대화체로."""

# --- 전체 대본 ---
FULL_SCRIPT = """의사가 뒷구멍을 파라고 해요, 파지 말라고 해요?

지금 뭔 소린가 싶죠?
근데 이거 듣고 안 궁금한 사람 없어요.

서울 지하철에서 겪은 일이에요.
요즘 지하철에서 뭐 파는 사람 나오면, 아무도 안 봐요.
다 폰만 보죠.

근데 한 아저씨가 이렇게 말한 거예요.
"자, 여러분. 의사가 뒷구멍을 파라고 해요, 파지 말라고 해요?"

아무도 대답은 안 했어요.
근데 전원이 쳐다봤어요.

왜 쳐다봤을까요?
답이 안 나왔으니까.
답 안 나온 상태에서 무시하는 게 더 불편한 거예요.
드라마 애매한 데서 끊기면 다음 편 보게 되는 거랑 똑같아요.

홈쇼핑도 마찬가지예요.
오늘 이런 여행 상품을 소개하겠습니다... 채널 돌리죠.
참기름은 바로 짠 게 맛있을까요, 숙성된 게 맛있을까요?
채널 못 돌려요. 전부 질문으로 시작해요.

우리도 똑같아요.
고객이 들을지 말지 결정하는 시간, 3초.
그 3초에 뭘 던지느냐가 전부예요.

똑같은 FP, 똑같은 고객.
한화손해보험 OOO입니다, 보장 분석 해드리려고요.
경계하죠.
고객님, 임신해도 돈 받고 안 해도 돈 받는 거 아세요?
그게 뭐예요?
첫마디 하나 바꿨을 뿐이에요.

답을 주지 마세요.
질문을 던지세요."""


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice", default="Leda")
    args = parser.parse_args()
    voice = args.voice

    client = genai.Client(api_key=API_KEY)
    full_content = f"{STYLE_PROMPT}\n\n---\n\n{FULL_SCRIPT}"

    print(f"🎙️ 후킹의 원리 TTS 생성 (음성: {voice})")

    response = client.models.generate_content(
        model=MODEL,
        contents=full_content,
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

    total_dur = len(pcm_data) / (sample_rate * 2)
    print(f"  전체 길이: {total_dur:.1f}초 ({len(pcm_data)/1024:.0f}KB)")

    # 저장
    out_path = OUT_DIR / "link-edu-hooking-why.wav"
    save_wav(pcm_data, out_path, sample_rate)
    print(f"  ✅ 저장: {out_path}")

    print(f"\n🎉 완료! Studio에서 재생해보세요.")


if __name__ == "__main__":
    main()
