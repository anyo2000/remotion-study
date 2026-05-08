"""
EP04 단어 하나가 만든 벽 — Gemini TTS 음성 생성

사용법:
  source .venv/bin/activate
  python scripts/generate-ep04-guard-down-tts.py
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
고객 대사를 인용할 때는 살짝 톤을 바꿔서 구분.
"단어가 오염되어 버린 거예요" 부분은 확신 있게.
"김영숙 FP가 오늘 새로운 마음으로 다시 전화를 걸었어요" 부분은 힘차고 밝게.
"어, 뭐가 바뀌었는데요?" 부분은 밝고 희망적으로.
문단 사이에 충분히 쉬어주세요."""

# --- 전체 대본 ---
FULL_SCRIPT = """여기 10년차 김영숙 FP님이 있습니다. 어제 이관받은 고객한테 전화를 걸었어요. 늘 하던 대로요.

"고객님, 안녕하세요. 이번에 담당자로 배정된 김영숙이라고 합니다. 다름이 아니라 한번 찾아뵙고 보장 분석 좀 해드리려고 연락드렸어요. 이번 주 중에 시간 괜찮으실 때로 한번..."

말이 끝나기도 전에 고객이 거절합니다.

"아, 받아봤어요. 한 열 번은 받아본 거 같은데. 또 다 해약하라는 거 아니에요? 보장 분석 한다고 하면 결국 그 얘기던데."

김영숙 FP가 멈칫해요. "아니, 그게 아니라 그냥 확인 한 번 봐드리려고요…" 말이 다 끝나기도 전에 전화가 끊겨요.

전화기 내려놓고 김영숙 FP가 한참 앉아있어요. "내가 뭘 잘못했지?" 멘트 늘 하던 멘트 그대로 한 건데. 몇년전까지만해도 "아, 그래요? 언제 시간 되세요?" 정도가 돌아왔을 멘트거든요. 그게 어제는 안 통한 거예요.

근데 이게 김영숙 FP만의 일일까요? 같은 날 오후 3시, 강남 어느 카페에서도 비슷한 일이 있었어요. 한쪽 테이블에선 FP가 노트북 펴면서 "고객님, 오늘 보장 분석해서 부족한 거 있나 한번 봐드리려구요" 하니까 고객이 슬쩍 핸드폰을 보기 시작했어요. 15분 만에 "죄송한데 다음에 뵐게요." 자리가 끝났죠.

그런데 바로 옆 테이블에선 다른 FP가 가방에서 자료도 꺼내지 않고 상담을 하고 있었어요. "고객님, 요즘 실손 제도가 많이 바뀌었거든요. 거기에 어떤 내용이 해당되시는지만 한번 설명드리려고 왔어요" 했더니 고객이 "어, 뭐가 바뀌었는데요?" 몸을 앞으로 기울였어요. 30분 뒤에 인증번호까지 받았고요.

같은 회사 FP, 같은 분석. 어떤 게 달라서였을까요?

1년차도, 10년차도, SFP도 다 겪어요. 우리가 못해서가 아니에요. 우리 앞에 벽이 하나 생긴거예요. 그 벽 이름이 '보장 분석'이에요.

여러 회사에서 몇 년 동안 똑같은 단어, 똑같은 패턴으로 제안했거든요. "보장분석해드릴게요." "부족한 거 채워드릴게요." "이번기회에 갈아타시면 좋아요." 이게 너무 오래, 너무 자주 반복되니까, 이제는 고객이 '보장 분석' 네 글자만 들어도 자동으로 방어 모드로 들어가요. 머리로 생각하기 전에 몸이 먼저 굳어요. 우리 잘못이 아니에요. 단어가 오염되어 버린 거예요.

그래서 우리는 같은 뜻을 다르게 표현하는 연습을 할 겁니다. "보장 분석 해드리려고요" 대신 "설명해드릴 게 있어서 연락드렸어요." "보험이 좀 부족하신 것 같다" 대신 "요즘 바뀐 치료방법들이 고객님 보험에서도 적용이 되는지 한번 확인해드리려고요." 개인정보를 받을 때도 "가입설계 동의 좀 해주세요"가 아니라 "인증 문자 보낸 거 앞에 숫자만 확인해주시면 돼요." 이렇게 거부감 없는 단어들로 매끄럽게 진행해보는 거예요.

김영숙 FP가 오늘 새로운 마음으로 다시 전화를 걸었어요. 두세군데 표현만 바꿔봤습니다. 그런데 이번엔 돌아온 대답이 "어, 뭐가 바뀌었는데요?"였어요. 5년 전 김영숙 FP가 잘했던 게 지금은 안 통하는 이유. 세상이 변한 거예요.

FP 여러분, 우리도 모르게 입에 붙어 있는 단어들이 있어요. 3년, 5년 전에는 신뢰의 시작이었던 표현들이 지금은 고객이 가장 빨리 마음을 닫게 만드는 신호로 바뀌어 있는 경우가 정말 많거든요. 본인은 자연스럽다고 느끼는데, 사실은 옛날 단어들을 그대로 쓰고 있는 거예요.

오늘 통화 한 건이라도 좋아요. 본인이 평소 어떤 첫마디로 고객한테 다가가는지, 한번 녹음해서 들어보시거나 옆 동료한테 그대로 들려줘 보세요. 거기에 고객이 부담스러워할 단어가 몇 개나 들어 있는지 본인이 들어보면 깜짝 놀라실 거예요. 그 단어 한두 개만 빼도, 통화 첫 1분의 공기가 완전히 달라집니다.

다음 편에서는 그럼 그 빈자리에 뭘 채울 건지, 진짜 후킹 화법으로 들어가볼게요."""


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def main():
    client = genai.Client(api_key=API_KEY)
    full_content = f"{STYLE_PROMPT}\n\n---\n\n{FULL_SCRIPT}"

    print("EP04 단어 하나가 만든 벽 TTS 생성 (음성: Leda)")

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

    out_path = OUT_DIR / "link-edu-ep04-guard-down.wav"
    save_wav(pcm_data, out_path, sample_rate)
    print(f"  저장: {out_path}")

    print(f"\n완료!")


if __name__ == "__main__":
    main()
