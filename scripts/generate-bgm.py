"""
BGM 생성 — Google Lyria 3 via Gemini API
영상 제작 파이프라인용 배경음악 자동 생성

사용법:
  source .venv/bin/activate
  python scripts/generate-bgm.py                          # 기본 (티저용 30초)
  python scripts/generate-bgm.py --prompt "밝은 피아노"    # 커스텀 프롬프트
  python scripts/generate-bgm.py --model pro               # Pro 모델 (고품질)
  python scripts/generate-bgm.py --output my_bgm.wav       # 파일명 지정

모델:
  clip (기본) — lyria-3-clip-preview: 빠름, 짧은 클립용
  pro         — lyria-3-pro-preview: 고품질, 긴 곡 가능
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

OUT_DIR = Path(__file__).parent.parent / "public" / "audio"
OUT_DIR.mkdir(parents=True, exist_ok=True)

MODELS = {
    "clip": "lyria-3-clip-preview",
    "pro": "lyria-3-pro-preview",
}

# --- 프리셋 프롬프트 ---
PRESETS = {
    "teaser": (
        "Generate a 30-second background music track for a professional teaser video. "
        "Style: modern corporate, confident and forward-looking. "
        "Instruments: soft piano melody, gentle synth pads, subtle bass, light percussion. "
        "Tempo: 110 BPM. Mood: building anticipation, clean and professional. "
        "Start minimal, build gradually, end with a subtle resolution. "
        "No vocals."
    ),
    "calm": (
        "Generate a 30-second calm background music. "
        "Style: ambient, warm. Instruments: acoustic piano, soft strings. "
        "Tempo: 80 BPM. Mood: reflective, trustworthy. No vocals."
    ),
    "upbeat": (
        "Generate a 30-second upbeat background music. "
        "Style: bright corporate pop. Instruments: piano, claps, synth. "
        "Tempo: 125 BPM. Mood: energetic, positive. No vocals."
    ),
    "dramatic": (
        "Generate a 30-second cinematic background music. "
        "Style: epic, building tension. Instruments: orchestral strings, deep bass, percussion crescendo. "
        "Tempo: 90 BPM. Mood: powerful, impactful. No vocals."
    ),
}


def save_wav(pcm_data, filepath, sample_rate=24000, channels=1, sample_width=2):
    """PCM 데이터를 WAV 파일로 저장"""
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def generate_bgm(prompt, model_id, output_path):
    """Lyria 3로 BGM 생성"""
    client = genai.Client(api_key=API_KEY)

    print(f"🎵 BGM 생성 중... (모델: {model_id})")
    print(f"   프롬프트: {prompt[:80]}...")

    response = client.models.generate_content(
        model=model_id,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
        ),
    )

    # 응답 파싱 — Lyria 3는 3파트: [메타, 텍스트설명, 오디오]
    audio_data = None
    mime_type = None
    caption = None

    for part in response.candidates[0].content.parts:
        if hasattr(part, "inline_data") and part.inline_data and part.inline_data.data:
            audio_data = part.inline_data.data
            mime_type = part.inline_data.mime_type
        elif hasattr(part, "text") and part.text:
            caption = part.text

    if not audio_data:
        print("❌ 오디오 데이터 없음")
        sys.exit(1)

    print(f"   응답 mime: {mime_type}, 크기: {len(audio_data)/1024:.0f}KB")
    if caption:
        # BPM, MOS 점수 등 요약 출력
        for line in caption.split("\n"):
            if any(k in line for k in ["BPM", "Mosic", "MOS"]):
                print(f"   {line.strip()}")

    # 포맷에 따라 저장
    if "mpeg" in (mime_type or "") or "mp3" in (mime_type or ""):
        # MP3 → 그대로 저장 (확장자 변경)
        mp3_path = output_path.with_suffix(".mp3")
        mp3_path.write_bytes(audio_data)
        print(f"   ✅ 저장: {mp3_path.name} ({len(audio_data)/1024:.0f}KB)")
        return mp3_path
    else:
        # PCM → WAV
        sample_rate = 24000
        if "rate=" in (mime_type or ""):
            try:
                sample_rate = int(mime_type.split("rate=")[1].split(";")[0])
            except (ValueError, IndexError):
                pass
        save_wav(audio_data, output_path, sample_rate=sample_rate)
        duration = len(audio_data) / (sample_rate * 2)
        print(f"   ✅ 저장: {output_path.name} ({duration:.1f}초)")
        return output_path


def main():
    parser = argparse.ArgumentParser(description="Lyria 3 BGM 생성")
    parser.add_argument("--prompt", default=None, help="커스텀 프롬프트")
    parser.add_argument("--preset", default="teaser", choices=PRESETS.keys(),
                        help="프리셋 (teaser/calm/upbeat/dramatic)")
    parser.add_argument("--model", default="clip", choices=MODELS.keys(),
                        help="모델 (clip/pro)")
    parser.add_argument("--output", default=None, help="출력 파일명")
    args = parser.parse_args()

    prompt = args.prompt or PRESETS[args.preset]
    model_id = MODELS[args.model]
    output_name = args.output or f"bgm-{args.preset}.wav"
    output_path = OUT_DIR / output_name

    generate_bgm(prompt, model_id, output_path)
    print(f"\n🎉 완료! {output_path}")


if __name__ == "__main__":
    main()
