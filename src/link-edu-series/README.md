# LINK 마이크로러닝 시리즈

## 폴더 구조

```
src/link-edu-series/
├── README.md              ← 이 파일 (구조 설명)
├── series-plan.md         ← 전체 목차 + 제작 상태
├── SeriesLayout.tsx       ← 전 에피소드 공통 레이아웃 (상단바, 여백, 제목 위치)
├── series-config.ts       ← 공통 설정 (팔레트, 폰트, Safe Zone, 타이틀카드 시간)
│
├── ep03-hooking-why/      ← 에피소드별 폴더
│   ├── script.md          ← 대본 원문
│   ├── spec.md            ← 비주얼 스펙 (뭘 언제 어떻게 보여줄지)
│   ├── beats.ts           ← BEATS 타이밍 데이터
│   ├── Full.tsx           ← Sequence 조립 + Audio
│   ├── Scene*.tsx         ← 씬 컴포넌트
│   └── Layout.tsx         ← (필요 시) 에피소드 전용 레이아웃 오버라이드
│
├── ep04-guard-down/       ← 다음 에피소드
│   ├── script.md
│   ├── spec.md
│   ├── beats.ts
│   └── ...
│
└── ...
```

## 공통 vs 에피소드별

| 항목 | 위치 | 설명 |
|------|------|------|
| 시리즈 목차 | `series-plan.md` | 21개 에피소드 목록 + 제작 상태 |
| 상단바 (LINK Consulting · L후킹 · 제목) | `SeriesLayout.tsx` | 전 에피소드 동일 포맷 |
| 팔레트, 폰트, Safe Zone | `series-config.ts` | 전 에피소드 동일 값 |
| 타이틀카드 포맷 | `SeriesLayout.tsx` | 4초, 동일 디자인 |
| 대본 | `ep{N}/script.md` | 에피소드마다 다름 |
| 비주얼 스펙 | `ep{N}/spec.md` | 에피소드마다 다름 |
| BEATS | `ep{N}/beats.ts` | 에피소드마다 다름 (음성 기반) |
| 씬 코드 | `ep{N}/Scene*.tsx` | 에피소드마다 다름 |
| 음성/타임스탬프 | `public/audio/link-edu-{id}.*` | Remotion이 여기서 읽음 |

## 음성 파일은 왜 여기 안 넣나?
Remotion의 `staticFile()`이 `public/` 폴더에서만 읽음. 구조적 제약.
대신 파일명 규칙으로 연결: `public/audio/link-edu-ep03-hooking-why.*`
