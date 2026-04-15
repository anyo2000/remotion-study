"""
후킹화법 EP1 오프닝 — Gemini TTS 음성 생성
2초 묵음(타이틀) + 장면 전환 0.7초 묵음 포함

사용법:
  source .venv/bin/activate
  python scripts/generate-hooking-opening-tts.py
  python scripts/generate-hooking-opening-tts.py --voice Zephyr
"""

import os
import sys
import wave
import struct
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
STYLE_PROMPT = """밝고 에너지 있는 교육 강사. 보험 영업 교육 영상 나레이션.
재밌게 이야기하듯이, 신입 FP도 이해할 수 있게 쉽고 경쾌하게.
핵심 단어에서 살짝 힘주고, 질문을 던질 때는 궁금하게.
답을 말할 때는 확신 있게.
[pause] 표시가 있는 곳에서 0.7초 정도 충분히 쉬어주세요.
자연스러운 대화체로."""

# --- 전체 대본 (장면 사이 [pause] 마커) ---
FULL_SCRIPT = """하나 여쭤볼게요. 의사가 귓구멍을 파라고 할까요, 말라고 할까요?

[pause]

갑자기 뭔 소리인가 싶으시죠. 근데 지금 여러분 머릿속에서 뭔가 돌아가고 있을 거예요. 이미 생각하고 계시잖아요. 이게 후킹이에요.

[pause]

서울 지하철에서 있었던 일이에요. 다들 폰만 보고 있었는데, 한 아저씨가 갑자기 큰 소리로 물어봐요. "의사가 귓구멍을 파라고 해요? 말라고 해요?" 아무도 대답은 안 했어요. 근데 모든 사람이 고개를 돌렸어요.

[pause]

왜 그랬을까요? 답이 바로 떠오르지 않으니까요. 답이 안 나오는 질문은 사람을 멈추게 합니다.

[pause]

드라마도 마찬가지예요. 딱 궁금한 데서 끊기면, 다음 편 안 보기 어렵잖아요. 홈쇼핑도 "좋은 여행 상품 소개해드릴게요" 하면 채널을 돌리는데, "참기름은 바로 짠 게 맛있을까요, 아닐까요?" 하면 손이 멈춰요.

[pause]

우리한테도 이 시간이 있어요. 3초. 고객들도 관심있게 얘기를 들을지 말지, 딱 3초 안에 결정하세요.

[pause]

그런데 우리가 보통 뭐라고 하죠? "안녕하세요, 한화손해보험입니다. 보장 분석 해드리려고 연락드렸어요." 고객 반응 아시잖아요. "아, 괜찮아요." 거기서 끝이에요.

[pause]

근데 이렇게 바꿔보시면요? "고객님, 임신해도 돈 받고 안 해도 돈 받는 보험이 있는 거 아세요?" 고객이 뭐라고 하실까요? "그게 뭔데요?"

[pause]

똑같은 FP가 보험얘기를 꺼내는데, 첫마디 하나만 바꿨을 뿐이에요. 답을 드리지 마세요. 질문을 건네세요. 그게 후킹입니다.

[pause]

이제 함께 후킹화법에 대해 본격적으로 공부해볼까요?"""


def generate_silence(duration_sec, sample_rate=24000):
    """묵음 PCM 데이터 생성"""
    num_samples = int(duration_sec * sample_rate)
    return struct.pack(f"<{num_samples}h", *([0] * num_samples))


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice", default="Zephyr")
    args = parser.parse_args()
    voice = args.voice

    client = genai.Client(api_key=API_KEY)
    full_content = f"{STYLE_PROMPT}\n\n---\n\n{FULL_SCRIPT}"

    print(f"🎙️ 후킹화법 EP1 오프닝 TTS 생성 (음성: {voice})")

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

    # 2초 묵음 앞에 붙이기
    silence_2s = generate_silence(2.0, sample_rate)
    final_pcm = silence_2s + pcm_data

    tts_dur = len(pcm_data) / (sample_rate * 2)
    total_dur = len(final_pcm) / (sample_rate * 2)
    print(f"  TTS 길이: {tts_dur:.1f}초")
    print(f"  +2초 묵음 → 전체: {total_dur:.1f}초")

    # 저장
    out_path = OUT_DIR / "hooking-opening.wav"
    save_wav(final_pcm, out_path, sample_rate)
    print(f"  ✅ 저장: {out_path}")

    print(f"\n🎉 완료! 다음: 타임스탬프 추출")


if __name__ == "__main__":
    main()
