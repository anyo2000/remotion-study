---
description: "V6 렌더 — MP4 렌더링 + Google Drive 저장 + git 커밋 + 정리"
---

# V6 렌더링 + 저장

**모델**: sonnet (기계적 실행)
**진행 표시**: `[6/6 완료]`

## 할 일

### 6-1. MP4 렌더링
```bash
npx remotion render src/index.ts {CompositionName} out/{filename}.mp4 \
  --codec h264 --crf 10
```

### 6-2. Google Drive 저장
```
cp out/{filename}.mp4 ~/Library/CloudStorage/GoogleDrive-anyo2000@gmail.com/내\ 드라이브/즐겨찾아/클로드작업/영상/{title}\ {YYMMDD}.mp4
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
