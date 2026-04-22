---
description: "V6 렌더 — MP4 렌더링 + Google Drive 저장 + git 커밋 + 정리"
---

# V6 렌더링 + 저장

**모델**: sonnet (기계적 실행)
**진행 표시**: `[6/6 완료]`

## 시작 메시지
이 스킬이 로드되면 가장 먼저 다음 메시지를 출력한다:
> 🔄 V6 렌더 시작

## 할 일

### 6-1. MP4 렌더링
**파일명 규칙: Composition ID를 그대로 사용한다.** (예: `LINK-OT-2-Familiar`)

```bash
npx remotion render src/index.ts {CompositionID} out/{CompositionID}.mp4 \
  --codec h264 --crf 10
```

### 6-2. Google Drive 저장
```
cp out/{CompositionID}.mp4 ~/Library/CloudStorage/GoogleDrive-anyo2000@gmail.com/내\ 드라이브/즐겨찾아/클로드작업/영상/{CompositionID}\ {YYMMDD}.mp4
```
- 날짜 형식: YYMMDD (예: 260412)

### 6-3. 정리
사용자가 "정리해"라고 하면:
1. 아카이브 폴더 생성: `archive/{title} {YYMMDD}/`
   - 대본, 음성, BGM 복사
2. 중간 파일 삭제 (사용자 승인 후):
   - `out/still-*.png` (검수용 스틸)
   - 임시 프리뷰 렌더
3. .gitignore가 archive/와 output mp4를 이미 제외함

### 6-4. Git 커밋
- 소스 파일만 스테이징 (mp4/wav 제외)
- 커밋 메시지: `{ProjectName} {한줄 설명}`

## 출력 포맷

```
렌더링 완료
- 파일: {filename}.mp4
- 길이: {duration}
- Drive: {저장 경로}
- Git: {commit hash}

[6/6 완료]
```

## 완료 메시지
이 단계의 모든 작업이 끝나면 반드시 다음 메시지를 출력한다:
> ✅ V6 렌더 완료

---✅ v6-render 스킬 실행
