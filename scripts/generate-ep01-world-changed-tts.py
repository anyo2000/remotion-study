"""
EP01 세상이 바뀌었다 — Gemini TTS 음성 생성

사용법:
  source .venv/bin/activate
  python scripts/generate-ep01-world-changed-tts.py
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

# --- 스타일 프롬프트 ---
STYLE_PROMPT = """따뜻하고 공감적인 동료 나레이터. 보험 FP 교육 영상.
같은 업계 선배가 편하게 얘기하는 느낌으로.
핵심 문장에서 살짝 멈추고 강조. 감정 전환점에서 톤 변화.
"아니에요. 진짜 여러분 잘못 아니에요" 부분은 진심으로 위로하듯.
마지막은 희망적이고 기대감 있게.
문단 사이에 충분히 쉬어주세요."""

# --- 전체 대본 ---
FULL_SCRIPT = """요즘 여의도의 식당들이 8시만 되면 문을 닫아요. 저녁에 사람이 안 모이거든요. 회식 자체가 거의 사라졌어요.

불과 5년 전만해도 우리가 교육받을 때는 이렇게 배웠잖아요. "사람을 자꾸 만나라. 선물 들고 가라. 택배 보내라. 친해지면 보험 얘기는 자연스럽게 나오게 돼 있다." 회사에 '택배 데이'라는 게 공식으로 있을 정도였으니까요. 그때는 그게 진짜 먹히던 시대였어요.

근데 이제 아니죠.

요즘 이관받은 MZ 고객한테 선물 들고 가보세요. "아, 안 받을게요. 부담스러워서요." 이 말이 바로 돌아와요. 요즘 사람들은 목적 있는 선물을 싫어하거든요. 그냥 주는 것도 싫은데, 나중에 보험 얘기하려고 주는 건 더 싫은 거예요.

두 번째. 의리로 가입해주는 시대, 끝났어요. 우리가 자동차보험 가격이 비싸서 다른회사로 고객이 떠나갈때 이렇게 생각했잖아요. '내가 1년에 이 고객한테 10만 원 값어치를 못 해주고 있나보다.' 맞는 말이었어요, 그때는. 근데 요즘은 자동차 보험이 5만 원, 10만 원 차이 나면 형제끼리도 회사 옮겨요. '형 때문에 내가 왜 10만 원을 손해 봐? 형도 그만큼 이득이 생기는것도 아니잖아.' 이게 요즘 세대 기준이에요. 의리 하나로 버티던 계약들이 지금은 흔들리고 있는 거죠.

세 번째. 이게 제일 무서워요. "보장 분석 해드릴게요." 이 말 자체가 벽이 돼버렸어요. "아, 받아봤어요." "열번 받아봤어요." "또 다 해약하라고 하는거 아니에요?" 이런 대답이 바로 돌아오잖아요. 여러 회사에서 몇 년 동안 비교하고 또 비교하고, 해약하고 다시 가입시키고 했으니까요. 그게 쌓여서 이제는 '보장 분석'이라는 단어만 꺼내도 고객이 방어 모드로 들어가는 거예요.

FP 여러분. 대면이 어렵고, 선물이 안 통하고, 의리가 안 먹히고, 우리가 입에 달고 살던 '보장 분석'이라는 말조차 거부감을 주는 세상.

이게 FP 한 분 한 분 실력 문제일까요? 아니에요. 진짜 여러분 잘못 아니에요. 무대가 통째로 바뀐 거예요. 오히려 예전 방식으로 훈련받으신 분들일수록 더 억울하실 거예요. 열심히 하고 계신데, 예전만큼 결과가 안 나오니까요.

그래서 우리가 접근을 뒤집어야 돼요. 예전에는 친해지고 나서 전문성을 보여줬잖아요. 이제는 순서를 뒤집는 거예요. 전문성부터 보여주고, 관계는 그다음에 따라오게.

이게 LINK 컨설팅이 나온 배경이에요. 특히 SFP처럼 첫 통화가 마지막 통화가 되는 FP님들한테는, 이건 생존의 문제예요. 앞으로 이런 요즘세상에 어떤 컨설팅이 필요한지 함께 나눠보도록 할게요."""


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def main():
    client = genai.Client(api_key=API_KEY)
    full_content = f"{STYLE_PROMPT}\n\n---\n\n{FULL_SCRIPT}"

    print("🎙️ EP01 세상이 바뀌었다 TTS 생성 (음성: Leda)")

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

    # sample rate 파싱
    sample_rate = 24000
    if "rate=" in mime:
        try:
            sample_rate = int(mime.split("rate=")[1].split(";")[0])
        except (ValueError, IndexError):
            pass

    total_dur = len(pcm_data) / (sample_rate * 2)
    print(f"  전체 길이: {total_dur:.1f}초 ({len(pcm_data)/1024:.0f}KB)")

    out_path = OUT_DIR / "link-edu-ep01-world-changed.wav"
    save_wav(pcm_data, out_path, sample_rate)
    print(f"  ✅ 저장: {out_path}")

    print(f"\n🎉 완료!")


if __name__ == "__main__":
    main()
