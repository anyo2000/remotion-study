"""
YRC Wine Talk 인스타 티저 — Gemini TTS 음성 생성 (원본, 표준 속도)

카드별 완급(배속)은 process-wine-talk-tempo.py에서 기계적으로 처리한다.

사용법:
  source .venv/bin/activate
  python scripts/generate-wine-talk-tts.py
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

STYLE_PROMPT = """밝고 신나는 20~30대 톤의 여성 나레이터. 와인 모임 인스타 티저 영상.
자연스럽고 안정된 발성으로, 친구에게 재밌는 소식을 알려주듯 경쾌하게.
"짜잔!"은 선물을 공개하듯 환하게.
"30만원"은 또렷하게 힘주어 강조.
"뭔지는… 와서 확인하세요"만 뜸을 들이며 미스터리하게.
맨 마지막 "궁금한 마음만 챙겨오세요!"는 절대 서두르지 말고,
"챙겨오세요~" 하고 끝을 여유 있게 살려서 여운이 남게 마무리해주세요.
각 문단은 완결된 멘트입니다 — 마지막 문장의 끝을 흐리지 말고 확실히 맺고,
다음 문단 전에 짧게 한 박자만 쉬어주세요.
이름 "안효성"은 또박또박 정확하게."""

FULL_SCRIPT = """짜잔! YRC 와인톡 스페셜데이를 소개합니다.

와인, 1도 몰라도 됩니다. YRC 와인톡에서 여러 가지 시음해보면서, 내 입맛에 맞는 와인을 찾아보세요. 그럼, 이번에 만날 와인들을 소개해 드립니다.

1번! 하얏트호텔 와인바에서 30만원 주고 마시는 샴페인. 비싼 건 정말 맛있을까? 향, 맛, 여운까지… 진짜 다를까 궁금하시죠?

2번! 여름 화이트, 아직도 클라우디 베이만? 가격은 더 착한데, 맛은 훌륭한 와인.

3번! 레드와인은 떫고 써서 싫다고요? 편견입니다. 레드 안 마시던 사람도 이건 술술 넘어갈걸요?

4번! 화이트와인이 가볍기만 하다는 편견, 여기서 끝. 이런 게 맛있는 화이트와인이구나 하실 거예요.

5번! 호스트, 안효성 픽. 나 술 좀 마셔봤는데? 하는 분들도, 이건 아마 처음일 걸요. 뭔지는… 와서 확인하세요.

다섯 잔, 싹 다 마셔봅니다. 와인 몰라도 오케이. 술 안 좋아해도 오케이. 많이 못 마셔도 오케이. 궁금한 마음만 챙겨오세요!"""


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def main():
    client = genai.Client(api_key=API_KEY)
    full_content = f"{STYLE_PROMPT}\n\n---\n\n{FULL_SCRIPT}"

    print("YRC Wine Talk 티저 TTS 생성 (음성: Leda)")

    response = client.models.generate_content(
        model=MODEL,
        contents=full_content,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name="Leda"
                    )
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

    total_dur = len(pcm_data) / (sample_rate * 2)
    print(f"  전체 길이: {total_dur:.1f}초 ({len(pcm_data)/1024:.0f}KB)")

    out_path = OUT_DIR / "wine-talk-teaser.raw.wav"
    save_wav(pcm_data, out_path, sample_rate)
    print(f"  저장: {out_path}")
    print("\n완료! 다음: python scripts/process-wine-talk-tempo.py")


if __name__ == "__main__":
    main()
