---
description: "V4 빌드 — 승인된 스타일로 전체 장면 제작"
---

# V4 전체 빌드

**모델**: sonnet (패턴 기반 코딩)
**진행 표시**: `[4/6 빌드완료]`

## 시작 메시지
이 스킬이 로드되면 가장 먼저 다음 메시지를 출력한다:
> 🔄 V4 빌드 시작

## 할 일

### 4-1. BEATS 데이터 생성 ⭐ (빌드 전 필수)
V2에서 생성한 word-level 타임스탬프(`{에피소드}.words.json`)를 로드하여 BEATS 파일 생성.

1. `public/audio/{에피소드}.words.json` 읽기
2. 씬별 시작 시간 확정 (timestamps.json 기반)
3. 각 씬의 핵심 비주얼 요소 ↔ 단어 타이밍 매핑
4. `src/{에피소드}/{에피소드}-beats.ts` 생성

**BEATS 파일 구조:**
```typescript
export const FPS = 30;
export const TITLE_DUR = 120; // 타이틀카드 4초
export const AUDIO_START = TITLE_DUR;
export const T = (sec: number) => Math.round(sec * FPS) + AUDIO_START;

const local = (audioSec: number, sceneStartSec: number) =>
  Math.round((audioSec - sceneStartSec) * FPS);

export const BEATS_씬이름 = {
  ELEMENT_KEY: local(단어시작초, 씬시작초), // "단어" 시점에 요소 등장
} as const;
```

**매핑 원칙:**
- 텍스트 등장 = 음성이 해당 단어를 말하는 시점 (±3프레임)
- 이모지/도형 등장 = 관련 문맥이 시작되는 시점
- pageTitle = 씬 시작 직후 (맥락 라벨이므로 즉시 노출 OK)

### 4-2. 씬 컴포넌트 코딩
- `src/components/` 기존 컴포넌트 먼저 확인 (component-registry 스킬)
- `src/constants.ts`에서 색상/spring/타이밍 가져오기
- **모든 타이밍은 BEATS import** — `spring({ frame: Math.max(0, frame - B.KEY), fps, config })`
- `frame - 20` 같은 감 기반 하드코딩 금지
- pageTitle은 맥락 라벨만 (결론 스포일러 금지)

### 4-3. 메인 컴포지션 조립
- `{에피소드}Full.tsx`: Sequence 배치 + Audio
- 타이틀카드: TITLE_DUR = 120 (4초)
- 오디오: `<Sequence from={AUDIO_START}>`
- 씬 시작: `T(초)` 함수 사용
- 교육영상(5분+)은 파트 분할 (파트당 2~3분)

### 4-4. 검증
- `node scripts/check-fontsize.js` — 52px 미만 0건 확인
- `npx tsc --noEmit` — 타입 에러 없음 확인
- BEATS 하드코딩 없음 확인 (`frame - ` 패턴 grep)

## 코딩 규칙 (CLAUDE.md 글로벌)
- **폰트 최소 52px** — 예외 없음
- **중앙축 정렬** 철저
- **팔레트 외 색상 사용 금지**
- **주인공은 하나** — 요소 4개+ 세로 나열 금지, 억지 대비 금지, 빈 박스 선노출 금지 (`references/visual-layout-guide.md` 참조)
- **숫자+단위 한 줄 유지** — 줄바꿈 시 폰트 축소 or 박스 확대
- **장면 간 갭(GAP) 없음** — 음성 자체의 호흡 쉼이 자연 간격. 인위적 GAP 금지
- **씬 시작 = 음성 타임스탬프 절대값** — `T(초)` 함수 사용. duration 합산 금지
- 마지막 장면 +75프레임 여유 (음성 잘림 방지)
- Safe Zone: 세로(상150/하170/좌우60), 가로(상하80/좌우100)
- 배경: radial-gradient 깊이감
- 조건부 렌더링 금지 — opacity로 숨길 것

## 파일 구조 (신규 에피소드)
```
src/{에피소드}/
├── {에피소드}-beats.ts       ← Step 1에서 생성 (타이밍 single source)
├── {에피소드}Full.tsx        ← Step 3에서 생성
├── Scene0_TitleCard.tsx
├── Scene1_xxx.tsx            ← BEATS import해서 사용
├── ...
└── SceneLayout.tsx           ← 공통 레이아웃 (복사 후 커스텀)
```

## 타이밍 수정 요청 시
씬 컴포넌트 열지 말고 `{에피소드}-beats.ts`의 숫자만 수정.
BEATS 파일이 single source — 컴포넌트는 자동 반영.

## 사전 참조 (반드시 로드)
- `references/visual-layout-guide.md` — 비주얼 경험 노트
- remotion-best-practices 스킬
- component-registry 스킬
- CLAUDE.md의 "BEATS 시스템" / "pageTitle 규칙" / "타이틀카드" 섹션
- V3에서 승인된 비주얼 방향표 (대화 이력에서 확인)

## 출력 포맷

```
빌드 완료
- 장면: {N}개 완성
- 총 프레임: {total} ({duration})
- BEATS: {beats.ts path} — {N}개 씬 매핑
- 파일: {file list}
- 폰트 검증: ✅
- 하드코딩 검증: ✅

[4/6 빌드완료] → 다음: 검수
```

## 완료 메시지
이 단계의 모든 작업이 끝나면 반드시 다음 메시지를 출력한다:
> ✅ V4 빌드 완료

## 다음 단계
빌드 완료되면 `/v5-qa` 스킬을 호출한다.

---✅ v4-build 스킬 실행
