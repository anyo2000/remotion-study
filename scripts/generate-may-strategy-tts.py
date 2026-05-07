"""
5월 영업전략 교안 — Gemini TTS 음성 생성

사용법:
  source .venv/bin/activate
  python scripts/generate-may-strategy-tts.py
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
STYLE_PROMPT = """따뜻하고 공감적인 교육팀 차장. 보험 FP 대상 월간 교육 강의.
지점장·FP들 앞에서 강의하는 느낌. 편안하지만 전달력 있게.
핵심 문장에서 살짝 멈추고 강조. 질문을 던질 때는 실제로 묻는 톤.
고객 대사를 인용할 때는 살짝 톤을 바꿔서 구분.
격려하는 부분은 진심으로. 숫자/날짜는 또렷하게.
문단 사이에 충분히 쉬어주세요."""

# --- 대본을 섹션으로 분할 ---
SECTIONS = [
    # 섹션 1: 오프닝
    """5월이에요. 정말 날씨가 좋아졌습니다.
오늘 강의 제목 보셨죠.
이게 왜 이번 달 핵심일까요?
평소에 고객 만나러 가시면서 무슨 생각 하세요?
"오늘은 이거 설명해야지." "이 담보 꼭 알려드려야지."
이런 생각으로 가시잖아요. 저도 그랬어요.
그런데 그렇게 가서 설명을 시작하면 고객이 어떤 표정 짓는지 아시죠?
살짝 굳어요. "또 영업이네" 이런 표정이요.

5월은 그 반대로 한 번 가보자는 겁니다.
내가 말 줄이고, 고객이 말하게 만드는 거.
고객 입에서 "내 보험료가 너무 올라서 걱정이에요",
"병원 다녀와도 돌려받는 게 별로 없네요",
"우리 부모님 실손은 어떻게 되는 거예요?"
이런 얘기가 나오면 그때부터 진짜 상담이 시작되거든요.
그럼 어떻게 하면 되는지. 오늘 같이 알아보시죠.""",

    # 섹션 2: 5월 세 가지 명분
    """첫 번째, 5월 7일에 5세대 실손이 출시됩니다.
요즘 뉴스에도 5세대 실손 얘기가 나오고 네이버에도 떠 있어요.
이거 보시고 우리 고객님들 마음이 어떨 것 같으세요? 다 궁금하세요.
"내 실손은 어떻게 되는 거지?" 다 한 번씩 생각하세요.
그런데 우리한테 먼저 전화하시는 분 거의 없어요. 왜 그러실까요?
보험은 먼저 물어보는 게 부담스러우신 거예요.
"물어봤다가 또 가입하라고 하면 어쩌지" 이런 마음이 있으시거든요.
그래서 우리가 먼저 가야 됩니다. 묻기 전에 가서 알려드리는 거. 그게 5월의 첫 번째 명분이에요.

두 번째, 가정의 달입니다.
5월은 1년 중에 가족에 대한 부채감이 가장 커지는 달입니다.
어버이날 있고, 어린이날 있고, 부부의 날까지 있어요.
분가했던 자녀들도, 잘 안 모이던 형제들도 자연스럽게 모입니다.
평소에는 보험 얘기 꺼내기 어색했던 고객도
이번 달엔 부모님 얘기, 자녀 얘기, 배우자 얘기가 자연스러워져요.
이렇게 가족 얘기 자연스러운 달이 1년에 며칠이나 되겠어요?
진짜 흔치 않아요. 우리한텐 더없이 좋은 활동 명분입니다.

세 번째가 진짜 중요해요. 5월 영업일이 18일밖에 안 됩니다.
짧아요. 수요일 출근하면 15영업일밖에 안 남아요.
1주차에 약속을 서두르지 않으면 월말에 시간이 정말 부족해집니다.
그래서 5월은 그냥 흘려보내면 안 되는 달이에요.
1주차에 명단 안 잡으시면 월말에 시간이 정말 부족합니다.
아, 5월이 끝나가는데 만난 사람이 별로 없네, 후회하기 딱 좋은 달이에요.
5월은 기다리는 달이 아닙니다. 먼저 질문을 꺼내는 달이에요.""",

    # 섹션 3: LINK 복습 + 5월 목표
    """여러분, 4월에 LINK 컨설팅 교육 들으셨죠.
들으실 때 어떠셨어요? 강의실에서는 "아 이거 좋네, 이거 써먹어야지"
하고 메모도 하시고 끄덕끄덕 하셨을 거예요.
그런데 그러고 며칠 지나서 고객님 만나러 가면서 어떠셨어요?
막상 나가서 써야지 하면 잘 생각이 안 나죠? 원래 그렇습니다.
한 번 들어서 되는 거 아니에요.
그래서 5월은 LINK 다 하자가 아닙니다.
L하고 I단계, 첫째 날만 해보자는 거예요.
N하고 K는 6월에 연습하면 됩니다.

제안서를 꺼내면 영업이고, 질문을 꺼내면 전문가입니다.
LINK에서 배운 거 다 잊으셔도 이 한 문장은 꼭 기억해주세요.
5월 한 달 이거면 됩니다.

L하고 I가 뭐였는지 한 번 다시 보겠습니다.
L 연결 단계는 고객이 반응할 만한 질문을 던지는 단계예요.
첫 3초 안에 고객 마음을 여는 단계.
I 진단 단계는 간편분석지로 고객이 자기 상황을 자기 눈으로 보게 만드는 단계입니다.
우리가 분석해주는 게 아니에요. 고객이 보면서
"어, 내 보험에 이게 빠졌네?" 느끼게 만드는 단계예요.

이 두 단계만 5월에 반복합니다.
그리고 5월에 진짜 중요한 거 하나만 더 말씀드릴게요.
5월 목표는 상담 횟수 늘리기입니다.
클로징 한 건이 아니라 첫 만남 다섯 번이 더 중요합니다.
왜냐하면 첫째 날 상담만 잘 풀어놓으면 두 번째 만남은 저절로 열리거든요.
고객이 인증번호 줬으면, 고객이 자기 상황 얘기했으면, 다음 약속은 그냥 따라옵니다.
그래서 5월은 상담의 양으로 가야 하는 달이에요.""",

    # 섹션 4: 실손 화법 — 피해야 할 말 vs 좋은 말
    """같은 실손 얘기를 해도, 어떻게 꺼내느냐에 따라 고객 반응이 완전히 달라집니다.
여러분 한 번 상상해보세요.
고객님이 댁에 계시는데 어느 날 우리한테 전화가 온 거예요.
"고객님, 5월에 5세대 실손 나오는데 지금 안 바꾸시면 손해예요. 폭탄 맞아요."
이 말 들으면 고객이 어떤 마음 드실까요?
두 가지 중에 하나일 거예요. "어, 그래?" 하고 신뢰하거나,
아니면 "또 시작이네" 하고 마음 닫거나. 대부분 두 번째입니다.

좌측 보세요. 피해야 할 말 세 가지.
"지금 안 바꾸시면 손해예요." "5세대 가셔야 합니다." "폭탄 맞아요."
많은 사람들이 이렇게 얘기해요.
빨리 알려드려야 할 것 같고, 강하게 얘기해야 결정할 것 같고.
근데 우리 마음이 급해지면 고객은 더 닫혀요. 이거 진짜예요.
해와 바람 이야기에서 바람이 아무리 세게 불어도 사람들은 옷을 꽉 붙잡잖아요.
그러면 어떻게 바꿔야 할까요?
이 세 마디만 던져도 고객이 1초 만에 마음이 풀려요.
"어, 이 사람은 나한테 뭘 강요하러 온 게 아니라 그냥 알려주러 왔구나" 이렇게 받아들이시거든요.

기억하실 거 한 가지. 5월 실손 상담의 목적은 즉시 전환이 아닙니다.
고객이 유지할지, 바꿀지, 보완할지 스스로 생각하게 만드는 게 목적이에요.
결정은 고객이 하시는 거예요.
우리는 판단 기준만 드리는 사람입니다.
5월 실손 화법의 핵심은 한 줄이에요.
전환 권유가 아니라 판단 기준 제공. 이 한 줄 꼭 기억하세요.""",

    # 섹션 5: 세대별 화법 카드
    """같은 실손이어도 가입한 시기마다 고객님들 마음이 다 달라요.
그래서 접근하는 방법과 화법도 달라져야 합니다.
이 부분을 화법 카드로 만들었는데요, 하나씩 자세히 설명해드릴게요.

실손 1세대, 2세대 고객님들께 전화하는 화법 전체를 적어봤습니다.
예시는 전화지만 만나서도 같은 방법으로 진행하셔도 됩니다.

3세대 고객님들은 어떨까요? 사실 이분들이 제일 답답하세요.
혜택이 1, 2세대만큼 좋은 것도 아닌데 보험료는 엄청 오르거든요.
작년에 5만 원이었는데 올해 6만 원, 내년에 7만 원.
1, 2, 3, 4 모든 세대 중에 인상률이 제일 높습니다.
근데 보장은 1, 2세대처럼 좋지도 않아요. 자기부담금도 있고요.
그래서 이럴 거면 바꿔야 하나 고민해본 적 있을 겁니다.

4세대 실손이 다른 세대랑 가장 다른 점이 뭔지 아세요?
1년 동안 비급여를 얼마나 썼는지에 따라 다음 해 보험료가 달라진다는 거예요.
비급여 안 쓰면 보험료 그대로, 많이 쓰면 최대 3배까지 할증이 됩니다.
근데 이 사실 모르시는 4세대 고객님 정말 많아요.
가입하실 때 약관에 분명히 있는데, 누가 그걸 다 기억하시겠어요.
그래서 4세대 고객님께 우리가 가는 이유는 두 가지예요.
첫째, 안심시켜드려야 하고. 둘째, 이 사실을 알려드려야 해요.

첫 마디. "고객님은 4세대라 지금 바뀌는 건 없어요." 안심부터 깔아드리세요.
그러고 나서 자연스럽게 본론으로 들어가요.
"다만 4세대는 1년 동안 비급여를 얼마나 쓰셨는지에 따라 다음 해 보험료가 달라지거든요.
그래서 한 번 점검해보자는 거예요."
3배까지 할증될 수 있다. 이거 들으면 고객 표정이 바뀝니다.
거의 모든 4세대 고객이 "예? 3배요?" 이렇게 반응하세요.
그게 그 자리에서 상담을 만드는 거예요.""",

    # 섹션 6: LINK × 실손 실전 적용
    """이제 4월에 배운 LINK를 5월 실손 상담에 어떻게 활용하는지 보여드릴게요.
여러분, 솔직하게 한 가지 말씀드릴게요.
LINK 들으면서 "이게 뭐 특별한 건가? 그냥 컨설팅 잘하라는 얘기 같은데?"
이렇게 느끼신 분들 분명히 계실 거예요. 그게 정상이에요.
왜냐하면 LINK는 별도 과목이 아니거든요.
그냥 우리 상담을 한 가지 이슈에 집중해서 풀어놓은 거예요.
5월에는 그 이슈가 실손이고요.

먼저 이 질문으로 시작합니다.
"고객님, 요즘 실손 어떠세요?" 정말 이게 다입니다.
몇 세대인지 묻지 마시고, 보험료 부담되시죠 묻지도 마세요.
그냥 "요즘 실손 어떠세요?" 이게 왜 강력한지 아세요?
이 질문은 고객이 빠져나갈 길이 없어요.
"어떠세요"라고 열린 질문으로 던지면 고객이 마음에 걸리는 점을 꺼내실 거예요.
거기서부터 상담이 출발하는 거예요.

이런 여러 가지 답변을 해주실 수 있는데, 어떤 답을 주시느냐에 따라
우리가 다음에 꺼낼 카드가 정해집니다.
그러니까 첫 질문 던져놓고, 잘 들으시면 돼요.
우리가 먼저 분석할 필요 없어요.
어느 카드로 가셨든 마지막은 똑같아요.
"이렇게 될 수도 있고 이럴 가능성도 있습니다.
정확한 건 인증번호 주시면 봐드릴게요."
이 한 마디로 첫 만남이 마무리됩니다.""",

    # 섹션 7: 분석지 활용 팁 + 클로징
    """여러분이 실손 간편분석지 교육을 받았어요.
너무 좋은 거에요, 고객한테 바로 써먹어야지 하고 약속을 잡았습니다.
그래서 고객을 만나서 처음부터 끝까지 꼼꼼하게
모든 세대 실손을 비교하면서 설명을 했어요.
고객의 반응은 어떨까요?
멍하게 있거나, 아니면 "잘 들었어요. 조심히 들어가세요" 이렇게 마무리되시거든요.
설명을 너무 자세하게 하면 고객이 다음에 만날 이유가 없어집니다.
정답을 주지 말고 궁금하게 만들어주세요.
이건 예를 들어 설명드린 거고, 인증번호 주시겠어요? 이렇게.

이번 달 핵심은 새로운 실손 판매가 아닙니다. LINK L, I 단계를 통한 종합형 보완설계예요.
5월에 우리가 할 일은 실손을 외워서 설명하는 게 아니에요.
고객 입에서 자기 보험 얘기, 보험료 얘기, 병원 다닌 얘기, 가족 실손 얘기가 나오게 만드는 겁니다.
1단계 질문, "요즘 실손 어떠세요?"
2단계 듣기, 보험료나, 병원 간 내역이나 비급여 치료 경험.
3단계 화법카드, 1, 2세대, 3세대, 4세대 중 맞는 카드로.
4단계 분석지, "이건 샘플이에요."
5단계 인증번호, "고객님 거 봐드릴까요."

여러분, 5월에 5세대 실손 계약이 중요한 게 아닙니다.
들으러 가세요. 고객 입에서 자기 보험 얘기가 나오면 그때부터 진짜 상담입니다.
그리고 그 상담 중에서 6월, 7월에 진짜 계약으로 돌아옵니다. 진짜예요.
LINK 컨설팅으로 시작하는 여러분의 5월,
진심으로 응원하겠습니다. 감사합니다.""",
]


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def merge_wav_files(wav_files, output_path):
    """여러 WAV 파일을 하나로 합침"""
    combined = b""
    sample_rate = 24000

    for wf_path in wav_files:
        with wave.open(str(wf_path), "rb") as wf:
            sample_rate = wf.getframerate()
            combined += wf.readframes(wf.getnframes())

    # 섹션 사이 0.8초 무음 추가
    silence = b"\x00\x00" * int(sample_rate * 0.8)
    parts = []
    for i, wf_path in enumerate(wav_files):
        with wave.open(str(wf_path), "rb") as wf:
            parts.append(wf.readframes(wf.getnframes()))

    combined = silence.join(parts)

    save_wav(combined, output_path, sample_rate)
    return len(combined) / (sample_rate * 2)


def main():
    client = genai.Client(api_key=API_KEY)
    section_files = []

    print(f"5월 영업전략 교안 TTS 생성 ({len(SECTIONS)}개 섹션, 음성: Leda)\n")

    for i, section_text in enumerate(SECTIONS):
        section_num = i + 1
        print(f"  [{section_num}/{len(SECTIONS)}] 섹션 {section_num} 생성 중...")

        content = f"{STYLE_PROMPT}\n\n---\n\n{section_text}"

        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=content,
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

            dur = len(pcm_data) / (sample_rate * 2)
            section_path = OUT_DIR / f"may-strategy-section-{section_num}.wav"
            save_wav(pcm_data, section_path, sample_rate)
            section_files.append(section_path)
            print(f"         {dur:.1f}초 ({len(pcm_data)/1024:.0f}KB)")

        except Exception as e:
            print(f"         오류: {e}")
            sys.exit(1)

    # 전체 병합
    print(f"\n  섹션 병합 중...")
    final_path = OUT_DIR / "may-strategy-full.wav"
    total_dur = merge_wav_files(section_files, final_path)
    print(f"  전체 길이: {total_dur:.1f}초 ({total_dur/60:.1f}분)")
    print(f"  저장: {final_path}")

    # 섹션 파일 정리
    for sf in section_files:
        sf.unlink()

    print(f"\n완료!")


if __name__ == "__main__":
    main()
