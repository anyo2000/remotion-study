"""
4월 인수확대 "선물 보따리" — Gemini TTS 음성 생성
Aoede 음성 (밝고 활기찬 톤)

사용법:
  source .venv/bin/activate
  python scripts/generate-april-gift-tts.py
  python scripts/generate-april-gift-tts.py --voice Puck
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
STYLE_PROMPT = """아주 밝고 에너지 넘치는 여성 나레이터.
동료에게 좋은 소식을 신나서 전하는 톤.
숫자에서 살짝 힘을 주며 강조하되, 전체적으로 경쾌하고 활기차게.
[pause] 표시에서 0.3초 정도 짧게 쉬어주세요.
각 문단 사이에 충분히 쉬어주세요.
마지막 "파이팅!!"은 정말 신나게 외쳐주세요."""

# --- 전체 대본 ---
FULL_SCRIPT = """화창한 봄, 4월입니다!
영업 현장에서 누구보다 땀 흘리시는 우리 FP님들을 위해!
봄꽃보다 더 활짝 핀, 특별한 선물 보따리를 준비했습니다!
바로 4월 한정! 인수 조건 대폭 확대!
과연 어떤 무기들이 준비되어 있을까요? 지금 바로 뜯어보시죠!

첫 번째 선물, 간병인 입원 생활비 한도 업그레이드!
그동안 프리미엄 플랜에서만 20만 원이 가능해서 아쉬우셨죠?
4월 한 달간! 올인원 플랜도 [pause] 20만 원 꽉꽉 채워드립니다!
고객님들께 제안할 때 정말 강력한 힘이 될 겁니다!

두 번째 선물, 따끈따끈한 신상! 4월 암 생활비 담보 출시!
저렴한 보험료로 혜택은 빵빵한데, 막상 한도가 꽉 차서 답답하셨다고요?
암 치료비, 비급여, 암 생활비 싹 다 합쳐서!
기존 4천만 원에서 [pause] 5천만 원까지 한도 훌쩍 높였습니다!

암만 늘려주면 섭섭하죠? 순환계 치료비도 팍팍 늘렸습니다!
순환계 치료비, 경증 질환까지 전부 다 포함해서!
2천만 원에서 [pause] 3천만 원으로 시원하게 확대합니다!

그리고 이건 역대급 희소식!
61세부터 70세 고객님들, 암과 순환계 생활비 한도가 500만 원이라 아쉬우셨죠?
이번 달, 자그마치 네 배!
생활비 한도 [pause] 총 2천만 원까지 든든하게 가입 가능합니다!

어? 올인원이 이렇게 좋으면, 프리미엄은 가입할 필요 없는 거 아니야?
에이, 아닙니다!
프리미엄 올인원의 암 치료비 합산 한도!
4천만 원에서 [pause] 무려! 7천만 원까지 치솟습니다!
VIP 고객님들께 딱이겠죠?

유병자 고객님들, 보험료 부담 때문에 망설이셨나요?
영업하시기 편하게 문턱을 확! 낮췄습니다!
간병인 가입 기준 최저 보험료가!
7만 원에서 [pause] 5만 원으로 뚝! 떨어졌습니다!

어른들만 챙기면 서운하죠! 0540 보험, 15세 이하 고객님을 위한 특별 혜택!
8대 용종 수술비 20만 원에서 30만 원으로 껑충!
질병 1종부터 5종 수술비 한도도 늘어납니다!
자녀보험 제안도 이번 달이 기회입니다!

자, FP님들!
이렇게 엄청난 혜택들, 누구한테 가장 먼저 알려주고 싶으신가요?
지금 머릿속에 딱! 스쳐 지나가는 바로 그 고객님!
망설이지 말고, 지금 당장 연락 한번 드려보세요!
오늘 말씀드린 이 모든 혜택은 [pause] 오직 4월 한 달간만 가능한 특별 혜택입니다!
FP님들의 대박 나는 4월 영업을 열렬히 응원합니다! 파이팅!!"""


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice", default="Aoede")
    args = parser.parse_args()
    voice = args.voice
    suffix = f"-{voice.lower()}"

    client = genai.Client(api_key=API_KEY)
    full_content = f"{STYLE_PROMPT}\n\n---\n\n{FULL_SCRIPT}"

    print(f"🎙️ 4월 인수확대 TTS 생성 (음성: {voice}, 모델: Pro)")

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

    # 전체 파일 저장
    full_path = OUT_DIR / f"april-gift{suffix}.wav"
    save_wav(pcm_data, full_path, sample_rate)
    print(f"  ✅ 저장: {full_path.name}")
    print(f"\n🎉 완료! 다음 단계: python scripts/extract-timestamps.py --file {full_path}")


if __name__ == "__main__":
    main()
