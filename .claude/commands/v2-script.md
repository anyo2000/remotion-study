---
description: "V2 대본 — 풀대본 작성 + TTS 생성 + Whisper 타임스탬프 추출"
---

# V2 대본 + TTS + 타임스탬프

**모델**: sonnet (기계적 실행)
**진행 표시**: `[2/6 대본완료]`

## 할 일

### 2-1. 대본 작성
- 장면 태그 포함 ([키워드 강조], [비교], [흐름도], [카드 나열], [숫자 임팩트], [대화 UI], [반전])
- 톤 마커 포함 (정돈/가벼운)
- 티저면 `reference_teaser_script_guide.md` 6단계 구조 적용
- **사용자 대본 승인 대기**

### 2-2. TTS 생성 (승인 후)
- Gemini Pro (`gemini-2.5-pro-preview-tts`) 사용
- 음성: v1에서 확정된 voice
- 스타일 프롬프트 형식:
  ```
  {감정/톤 지시}
  ---
  {본문}
  ```
- 저장: `public/audio/`
- 다중 화자 시 화자별 별도 TTS

### 2-3. 타임스탬프 추출
- `scripts/extract-timestamps.py` 또는 `scripts/extract-timestamps-gemini.py` 실행
- **전 장면 키워드별 타임스탬프를 한번에 추출** (장면별 개별 추출 금지)
- JSON으로 저장
- 키워드 시작 시간 → 프레임 번호 변환 (시간 x fps)

## 핵심 규칙
- **무음 구간 감지로 장면 분할하지 말 것** — 숨쉬기/쉼표도 무음으로 잡혀서 싱크 어긋남
- 타임스탬프는 Whisper 단어별 시작/끝 시간 기반
- 대본 승인 전에 TTS 생성하지 말 것

## 사전 참조
- spec-writing 스킬
- `references/gemini-voice-catalog.md`

## 출력 포맷

대본 승인 후:
```
대본 + 타임스탬프 완료
- 장면 수: {N}
- 총 길이: {duration}
- 음성: {voice name}
- 타임스탬프: {json path}

[2/6 대본완료] → 다음: 미니샘플
```
