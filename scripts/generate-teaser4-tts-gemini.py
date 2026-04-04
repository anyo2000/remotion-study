"""
LinkTeaser4 — Gemini TTS 음성 생성 (단일 호출로 일관된 목소리)
전체 대본을 한 번에 보내고, 결과물을 장면별로 분할

사용법:
  source .venv/bin/activate
  python scripts/generate-teaser4-tts-gemini.py
  python scripts/generate-teaser4-tts-gemini.py --voice Zephyr
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
STYLE_PROMPT = """자신감 있고 따뜻한 나레이터. 보험 교육 티저 영상.
절제된 톤이지만 핵심 숫자에서 살짝 멈추고 강조.
마지막으로 갈수록 기대감을 높이는 느낌.
자연스러운 대화체로, 딱딱하지 않게.
전체를 하나의 흐름으로 자연스럽게 이어서 읽어주세요.
각 문단 사이에 충분히 쉬어주세요."""

# --- 전체 대본 ---
FULL_SCRIPT = """요즘 10명 상담하면 몇 건 정도 체결하시나요? 2건? 1건? 그럼 나머지 고객은, 어디서 떨어진 걸까요?
...
...
관심 없다는 고객, 인증번호를 안 주는 고객, 생각해볼게요로 끝나는 고객.
...
...
우리가 매일 마주치는 이 벽을, 단계별로 부수는 방법이 있습니다.
...
...
관계가 아니라 실력으로 계약하는 방법, 링크 컨설팅.
...
...
4월. 곧 찾아갑니다."""

# --- 장면별 대본 (분할 기준용) ---
SEGMENTS = [
    "요즘 10명 상담하면 몇 건 정도 체결하시나요? 2건? 1건? 그럼 나머지 고객은, 어디서 떨어진 걸까요?",
    "관심 없다는 고객, 인증번호를 안 주는 고객, 생각해볼게요로 끝나는 고객.",
    "우리가 매일 마주치는 이 벽을, 단계별로 부수는 방법이 있습니다.",
    "관계가 아니라 실력으로 계약하는 방법, 링크 컨설팅.",
    "4월. 곧 찾아갑니다.",
]


def save_wav(pcm_data, filepath, sample_rate=24000):
    with wave.open(str(filepath), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(pcm_data)


def detect_silence(pcm_data, threshold=800, min_silence_samples=9600):
    """무음 구간 감지 (16bit PCM). min_silence_samples=9600 → 0.4초@24kHz"""
    samples = struct.unpack(f"<{len(pcm_data)//2}h", pcm_data)
    silent_regions = []
    start = None

    for i, s in enumerate(samples):
        if abs(s) < threshold:
            if start is None:
                start = i
        else:
            if start is not None and (i - start) >= min_silence_samples:
                silent_regions.append((start, i))
            start = None

    # 마지막 구간
    if start is not None and (len(samples) - start) >= min_silence_samples:
        silent_regions.append((start, len(samples)))

    return silent_regions


def split_by_silence(pcm_data, num_segments, sample_rate=24000):
    """무음 구간에서 분할. num_segments 개로 나눔."""
    silent_regions = detect_silence(pcm_data, threshold=800, min_silence_samples=int(sample_rate * 0.3))

    print(f"  감지된 무음 구간: {len(silent_regions)}개")
    for i, (s, e) in enumerate(silent_regions):
        print(f"    #{i}: {s/sample_rate:.1f}s ~ {e/sample_rate:.1f}s ({(e-s)/sample_rate:.1f}s)")

    # 가장 긴 무음 구간부터 분할 포인트로 사용
    # num_segments개로 나누려면 num_segments-1개의 분할점 필요
    needed = num_segments - 1

    if len(silent_regions) < needed:
        print(f"  ⚠️ 무음 구간이 {len(silent_regions)}개로 부족 ({needed}개 필요). 균등 분할로 대체.")
        total_samples = len(pcm_data) // 2
        chunk_size = total_samples // num_segments
        splits = []
        for i in range(num_segments):
            start_sample = i * chunk_size
            end_sample = (i + 1) * chunk_size if i < num_segments - 1 else total_samples
            splits.append(pcm_data[start_sample * 2:end_sample * 2])
        return splits

    # 무음 구간을 시간순으로 정렬하고, 가장 긴 것들을 분할점으로 선택
    # 단, 시간 순서 유지
    sorted_by_length = sorted(silent_regions, key=lambda r: r[1] - r[0], reverse=True)
    cut_points = sorted(sorted_by_length[:needed], key=lambda r: r[0])

    # 분할점의 중간 지점에서 자름
    cut_samples = [((s + e) // 2) for s, e in cut_points]

    splits = []
    prev = 0
    for cut in cut_samples:
        splits.append(pcm_data[prev * 2:cut * 2])
        prev = cut
    splits.append(pcm_data[prev * 2:])

    return splits


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice", default="Leda")
    args = parser.parse_args()
    voice = args.voice
    suffix = f"-{voice.lower()}"

    client = genai.Client(api_key=API_KEY)
    full_content = f"{STYLE_PROMPT}\n\n---\n\n{FULL_SCRIPT}"

    print(f"🎙️ 전체 대본 단일 생성 (음성: {voice}, 모델: Pro)")

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
    full_path = OUT_DIR / f"teaser4-full{suffix}.wav"
    save_wav(pcm_data, full_path, sample_rate)
    print(f"  ✅ 저장: {full_path.name}")

    # 무음 구간 분석 → 장면 전환 타임스탬프 제안
    print(f"\n📍 무음 구간 (장면 전환 후보):")
    silent_regions = detect_silence(pcm_data, threshold=800, min_silence_samples=int(sample_rate * 0.5))

    fps = 30
    for i, (s, e) in enumerate(silent_regions):
        start_sec = s / sample_rate
        end_sec = e / sample_rate
        mid_sec = (s + e) / 2 / sample_rate
        mid_frame = round(mid_sec * fps)
        print(f"  #{i}: {start_sec:.1f}s ~ {end_sec:.1f}s (쉼 {end_sec-start_sec:.1f}s) → 전환 프레임: {mid_frame}")

    # 가장 긴 무음 4개를 장면 전환점으로 제안
    if len(silent_regions) >= 4:
        sorted_by_len = sorted(silent_regions, key=lambda r: r[1] - r[0], reverse=True)
        top4 = sorted(sorted_by_len[:4], key=lambda r: r[0])
        print(f"\n🎬 추천 장면 전환 (가장 긴 무음 4개):")
        prev_sec = 0
        for i, (s, e) in enumerate(top4):
            mid_sec = (s + e) / 2 / sample_rate
            mid_frame = round(mid_sec * fps)
            scene_dur = mid_sec - prev_sec
            print(f"  S{i+1}: {prev_sec:.1f}s ~ {mid_sec:.1f}s ({scene_dur:.1f}초, {round(scene_dur*fps)}fr) → S{i+2} 시작 프레임: {mid_frame}")
            prev_sec = mid_sec
        remaining = total_dur - prev_sec
        print(f"  S5: {prev_sec:.1f}s ~ {total_dur:.1f}s ({remaining:.1f}초, {round(remaining*fps)}fr)")
        print(f"\n  총 프레임: {round(total_dur * fps)}")

    print(f"\n🎉 완료! 이 타임스탬프를 기반으로 LinkTeaser4.tsx의 Sequence from 값을 설정하세요.")


if __name__ == "__main__":
    main()
