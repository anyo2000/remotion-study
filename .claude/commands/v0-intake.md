---
description: "V0 접수 — 주제, 소재 위치, 형식(티저/교육) 파악"
---

# V0 접수

**모델**: opus
**진행 표시**: `[0/6 접수]`

## 할 일

1. 사용자 메시지에서 주제와 소재 위치 파악
2. mybrain 레포에서 관련 지식 탐색:
   - 먼저 `~/Desktop/workspace/mybrain/knowledge/index.md` 읽어서 목차 확인
   - 관련 파일을 `knowledge/`와 `output/`에서 찾기
   - **mybrain 접근 전 git pull 실행**
3. 형식 결정:
   - 티저 (~1분, 세로 9:16, 1080x1920)
   - 교육영상 (5~10분, 가로 16:9, 1920x1080, 파트 분할)
4. 사용자에게 확인

## 사전 참조
- 티저 형식이면 → 프로젝트 메모리 `reference_teaser_script_guide.md` 읽기
- `references/gemini-voice-catalog.md` 읽어서 음성 후보 파악

## 출력 포맷

```
접수 완료
- 주제: {topic}
- 소재: {찾은 파일들}
- 형식: {티저/교육} | {세로/가로}
- 예상 길이: {duration}

[0/6 접수] → 다음: 컨셉 3안
```
