"""
EP02 친숙보다 중요한 것 — Gemini TTS 음성 생성

사용법:
  source .venv/bin/activate
  python scripts/generate-ep02-familiar-tts.py
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
"딱 하나 남아요. 관계예요." 부분은 확신 있게, 힘 있게.
"이게 가능할까요? 가능해요." 부분은 희망적이고 자신감 있게.
문단 사이에 충분히 쉬어주세요."""

# --- 전체 대본 ---
FULL_SCRIPT = """첫 통화에서 고객이 "아 관심 없어요" 하고 전화를 끊어요. 그 고객, 이제 영영 못 만나요.

SFP FP님들, 또는 이관받은 고객과 첫통��하는 FP님들이 매일 겪는 상황이에요. 얼굴도 못 본 고객이랑 통화 한 번으로 약속을 잡아야 하거든요. 첫 통화가 마지막 통화가 될 수 있어요.

친해질 시간? ��어요. 선물 들고 갈 기회? 없어요. 이관받았다고 인사할 기회? 없어요. 근데 FP 여러분, 이게 SFP만의 얘기일까요?

��러회사 비교 판매하는 어떤 회사에서 이런 회의가 있었다고 해요. "10년 안에 우리나라 FP의 절반이 없어질 거다."

왜 그럴까요.

��각해보세요. 가장 싸고, 가장 혜택 좋고, 가입 쉬운 상품 찾아서 추천해주는 거. 이거 누가 제일 잘할까요? AI예요. 사람이 AI 이길 수가 없어요. 여러 회사 상품을 싹 비교해서 고객한테 맞는 걸 뽑는 거, 컴퓨터가 1초 만에 해요. 그래서 GA의 장점이 없어질거라는거에요.

그럼 우리 전속 FP는 뭐로 먹고살아야 할까요?

딱 하나 남아요. 관계예요.

"이 사람은 내가 가장 잘 아는 사람이다." 이 고객 가족 구성�� 어떤지, 이 고객 성향이 어떤지, 최근에 어떤 걱정을 하고 있는지. 이건 컴퓨터로 못 찾거든요. 우리가 아는 거예요.

그래서 우리가 순서를 바꾸기로 한 거예요. 관계가 먼저 있고 전문성이 따라오던 시대는 갔으니까, 이제는 전문성을 먼저 보여주고 관계가 따라오게. 이 순서를 바꾸는 일이 지금 시대에 맞는 답이에요.

그리고 FP 여러분, 진짜 역설 하나 알려드릴게요. 요즘 보험이 이렇게 복잡해진 거, 저는 오히려 우리한테 기회라고 봐요.

보��이 예전���럼 단순했으면요? 우리가 할일은 벌써 없어졌어요. 다이렉트로 가입하면 되니까요. 근데 지금은 종합형 담보가 200개, 암 담보만 해도 30��예요. 너무 복잡하니까 고객이 우리한테 물어보는 거예요. "이건 뭐가 ��라요? 저한테 왜 필요해요?" 이 질문 하나가 우리한테 남은 기회거든요.

단, 조건이 있어요.

우리가 예전 교육받을 때는 15분이 기본이었어요. "보장 분석 15분 안에 못 끝내잖아, 이 사람 안 들어줘." 이렇게 배웠죠. 근데 요즘은요? 15분? FP 여러분, 15분 시간내달라고 하기 진짜 힘들어요. 5분도 어려워요. 1분 안에 이 사람 관심 못 잡으면, 그날은 진행이 안 돼요.

정리할게요. AI가 못 주는 걸 우리가 줘야 하고, 복잡한 걸 쉽게 풀어줘야 하고, 그걸 1분 안에 해내야 해요.

이게 가능할까요? 가능해요. 방법이 있으니까요.

다음 편에서 L·I·N·K 네 글자의 전체 지도를 펼쳐서 설명해드릴게요."""


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def main():
    client = genai.Client(api_key=API_KEY)
    full_content = f"{STYLE_PROMPT}\n\n---\n\n{FULL_SCRIPT}"

    print("🎙️ EP02 친숙보다 중요한 것 TTS 생성 (음성: Leda)")

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

    out_path = OUT_DIR / "link-edu-ep02-familiar.wav"
    save_wav(pcm_data, out_path, sample_rate)
    print(f"  ✅ 저장: {out_path}")

    print(f"\n🎉 완료!")


if __name__ == "__main__":
    main()
