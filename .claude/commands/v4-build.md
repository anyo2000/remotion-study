---
description: "V4 빌드 — 승인된 스타일로 전체 장면 제작"
---

# V4 전체 빌드

**모델**: sonnet (패턴 기반 코딩)
**진행 표시**: `[4/6 빌드완료]`

## 할 일

1. **전체 장면 스펙 작성** (v3에서 승인된 스타일 기반)
   - 각 장면 medium~tight 레벨
   - spec-writing 스킬 참조
2. **Remotion 코딩**
   - `src/components/` 기존 컴포넌트 먼저 확인 (component-registry 스킬)
   - `src/constants.ts`에서 색상/spring/타이밍 가져오기
   - 모든 애니메이션 `useCurrentFrame()` 기반
   - Whisper 타임스탬프(v2)로 오디오 싱크
3. **교육영상(5분+)은 파트 분할**
   - 파트당 2~3분
   - 각 파트 = Root.tsx에 별도 Composition
4. **오디오 연결**
   - `<Audio src={staticFile("audio/...")} />`
   - BGM은 volume 0.08~0.12

## 코딩 규칙 (CLAUDE.md 글로벌)
- **폰트 최소 52px** — 예외 없음. 내용 길면 내용을 줄이거나 레이아웃 변경
- **중앙축 정렬** 철저
- **팔레트 외 색상 사용 금지**
- 장면 간 갭: 21프레임 (0.7초)
- 전환: TransitionSeries fade
- 마지막 장면 +75프레임 여유 (음성 잘림 방지)
- Safe Zone: 세로(상150/하170/좌우60), 가로(상하80/좌우100)
- 배경: radial-gradient 깊이감

## 사전 참조 (반드시 로드)
- remotion-best-practices 스킬
- component-registry 스킬

## 출력 포맷

```
빌드 완료
- 장면: {N}개 완성
- 총 프레임: {total} ({duration})
- 파일: {file list}

[4/6 빌드완료] → 다음: 검수
```
