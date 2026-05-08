"""
EP05 임신해도, 임신 안 돼도 — Gemini TTS 음성 생성

사용법:
  source .venv/bin/activate
  python scripts/generate-ep05-hooking-pregnancy-tts.py
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

STYLE_PROMPT = """따뜻하고 공감적인 동료 나레이터. 보험 FP 교육 영상.
같은 업계 선배가 편하게 얘기하는 느낌으로.
핵심 문장에서 살짝 멈추고 강조. 감정 전환점에서 톤 변화.
고객 대사를 인용할 때는 살짝 톤을 바꿔서 구분.
"임신하면 돈 받고, 임신 못 해도 돈 받는" 부분은 호기심을 유발하듯 살짝 띄워서.
"고객이 듣고 싶게 만드는 거" 부분은 확신 있게 힘주어.
문단 사이에 충분히 쉬어주세요."""

FULL_SCRIPT = """카페에서 만난 고객이에요. 28살, 회사 다니는 여자분. 지인 소개로 겨우 약속 잡은 건데, 앉자마자 이렇게 말해요.

"저 보험 관심 없거든요. 언니가 한번만 만나보라 해서 온 건데, 길게는 못 있어요."

벌써 문이 닫혀 있어요. 여기서 "고객님, 그래도 보장 한번 봐드릴게요" 하면? 네 오늘 상담은 끝이에요. 커피만 마시고 헤어지는 거예요.

왜 끝이냐면요. 보험이라는 분야는 고객 머릿속에 이미 답이 정해져 있어요. 우리가 무슨 단어를 골라도 그 다음에 올 말을 고객이 미리 짐작합니다. "좋은 상품"이라고 하면 "팔려는 거구나", "혜택"이라고 하면 "돈 더 내라는 거지." 그래서 첫마디는 답이 정해진 질문으로는 안 돼요. 살면서 한 번도 들어본 적 없는 조합의 한 줄이어야 합니다. 어 뭐지? 하는 사이에 방어막을 펼칠 타이밍을 놓치는 거예요.

근데 우리 FP님이 자료 한장 꺼내지 않고 이렇게 얘기를 하는 거예요.

"아, 네. 보험 가입하시라는 얘기 하지 않을게요. 근데 하나만 여쭤볼게요. 혹시 임신하면 돈 받고, 임신 못 해도 돈 받는 보험 있는 거 아세요?"

고객이 커피잔 내려놓고 쳐다봐요. "…네? 그게 뭐예요?"

고객의 반응이 멈췄어요.

FP님이 웃으면서 "아, 저도 처음 들었을 때 무슨 소리인가 했어요." 그러고는 설명을 시작하는 게 아니라, 또 질문을 해요. "혹시 주변에 결혼 준비하는 친구들 있으세요?"

고객이 "네, 좀 있죠" 하니까 FP가 이렇게 말해요.

"요즘 결혼 앞두고 보험 알아보는 분들이 많거든요. 근데 대부분 모르시는 게, 저희 회사는 임신이 잘 돼서 아기가 생기면 임신축하금, 출산축하금이 나오고요. 혹시라도 뜻대로 안 돼서 난임 병원 다니시게 되면 난임 진단비와 치료 비용도 나와요. 기쁠 때도 힘들 때도 보장이 되는 건데, 이걸 아는 분이 별로 없더라고요."

고객 표정이 바뀌어요. "그런 게 있어요? 저 친구가 지금 난임 병원 다니는데…"

여기서 포인트가 뭐냐면요. FP가 보험을 판매하려고 노력한 게 아니에요. 고객이 먼저 궁금해한 거예요.

근데 여기서 실수하면 안 되는 게 있어요. 고객이 관심을 보이면 설계사들은 본능적으로 상품 설명을 시작하거든요. 보장 내용이 어떻고, 보험료가 얼마고. 그러면 방금 어렵게 열린 고객 마음의 문이 다시 닫혀요.

이 FP는 달랐어요. 고객이 궁금해하니까 오히려 한 발 물러나요.

"궁금하시면 나중에 만나뵙고 자세히 설명 드릴게요. 근데 이게 재밌는 게, 지금 미혼이시잖아요. 지금 예약 담보로 신청하시면 돈을 안 내요. 나중에 결혼하시면 그때부터 내는 거예요."

고객이 "그게 가능해요?" 또 물어봐요. FP가 부담을 주지 않으니까, 고객이 자꾸 물어보는 거예요.

반대 상황도 있어요. "저 결혼 생각 없는데요." 이런 고객. 여기서 당황하면 안 돼요. "아, 오히려 더 좋아요. 혹시 모르니까 예약만 걸어 놓는 거거든요. 어차피 결혼 전에는 보험료를 내지 않으셔도 되니까 손해는 없습니다."

여기서 한 가지 더. 예전같으면 이쯤에서 "결혼 계획 있으세요? 임신 계획 있으세요?" 바로 고객에게 물어봤을 거예요. 근데 요즘에 이런 사적인 부분을 질문하는 건 고객에게 부담을 주게 될 수 있습니다. 순서가 반대입니다. 우리가 먼저 "안 하셔도 돼요" 하고 문을 열어주면, 고객이 알아서 자기 얘기를 꺼내기가 편해져요.

정리해볼게요. 이 대화에서 FP가 한 건 딱 세 가지예요.

첫째, 보험 얘기가 아닌 것처럼 질문을 던졌어요.
둘째, 고객이 궁금해할 때 설명을 쏟아붓지 않고 한 발 물러났어요.
셋째, 거절이 와도 "오히려 괜찮아요"로 받아쳤어요.

이게 후킹이에요. 내가 말하고 싶은 걸 말하는 게 아니라, 고객이 듣고 싶게 만드는 거.

다음 편에서는 두 번째 후킹 화법을 알려드릴게요. 우리가 매일같이 파는 그 담보를, 한 줄로 어떻게 꺼내야 고객을 당길 수 있는지."""


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def main():
    client = genai.Client(api_key=API_KEY)
    full_content = f"{STYLE_PROMPT}\n\n---\n\n{FULL_SCRIPT}"

    print("EP05 임신해도, 임신 안 돼도 TTS 생성 (음성: Leda)")

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

    out_path = OUT_DIR / "link-edu-ep05-hooking-pregnancy.wav"
    save_wav(pcm_data, out_path, sample_rate)
    print(f"  저장: {out_path}")
    print(f"\n완료!")


if __name__ == "__main__":
    main()
