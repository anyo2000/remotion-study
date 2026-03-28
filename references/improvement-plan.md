---
date: 2026-03-28
source: cstudy 대화 — Any No Code 리모션 영상 분석 + remotion-study 현황 진단
---

# remotion-study 구조 개선 계획

## 현황 진단

7개 영상을 만들면서 CLAUDE.md에 원칙은 잘 잡혀있음. 하지만:
- 재사용 가능한 패턴이 매번 새로 만들어지고 있음 (spring, 카운트업, stagger 등)
- 대본에서 바로 코딩으로 넘어가서 AI가 디자인+모션+레이아웃을 동시에 추측
- 공유 컴포넌트/유틸 없이 7개 파일에 같은 코드 중복
- references/ 폴더 CLAUDE.md에 언급했지만 미생성

## 개선 방향 (Any No Code 영상 9단계 워크플로우 참고)

### 핵심 아이디어: "관심사 분리"
한 번에 다 시키지 말고, 디자인 결정 / 스토리 결정 / 모션 결정 / 코딩을 분리

```
현재:  대본 → (한 번에) → 완성 컴포지션
개선:  대본 → 스토리보드 → 에셋 확인 → 모션 확인 → 씬 생성 → 조립
```

### 1단계: 공유 컴포넌트 추출 (구조 작업)

7개 컴포지션에서 반복되는 패턴을 유틸로 추출:

**애니메이션 유틸 (src/utils/animations.ts)**
- springEntrance: spring 기반 등장 (opacity + translateY)
- staggerEntrance: 순차 등장 (i * delayFrames)
- countUp: 숫자 카운트업
- flicker: 깜빡임 효과
- fadeTransition: 씬 전환 페이드

**레이아웃 컴포넌트 (src/components/)**
- SafeZone: 상150/하170/좌우60 래퍼
- Background: 라디얼 그라데이션 배경 (팔레트 받아서 적용)
- Headline: 두괄식 헤드라인 (키워드 + 설명)
- Card: 카드 컴포넌트 (팔레트의 card색 사용)

**씬 타입 템플릿 (src/templates/)**
- KeywordEmphasis: [키워드 강조] 템플릿
- Comparison: [비교] 템플릿
- FlowChart: [흐름도] 템플릿
- CardList: [카드 나열] 템플릿
- NumberImpact: [숫자 임팩트] 템플릿
- DialogueUI: [대화 UI] 템플릿
- Twist: [반전] 템플릿

### 2단계: 워크플로우에 "스토리보드" 단계 추가

새 영상 만들 때 대본 → 코딩 사이에 중간 단계:

```
대본 작성
↓
스토리보드 정리 (씬별로 어떤 타입인지, 어떤 에셋 필요한지)
↓
팔레트 확정
↓
TTS 생성
↓
씬별 생성 (템플릿 기반)
↓
조립 + 폴리싱
```

### 3단계: 레퍼런스 축적

- references/ 폴더에 잘 나온 영상/씬 기록
- 차장님이 "좋다"고 한 것만 저장 (AI가 추론하지 않음)
- 다음 영상 만들 때 "이런 느낌으로" 참고 가능

## 참고한 영상

Any No Code — "Claude Code + Remotion으로 모션그래픽 만들기"
- 9단계 워크플로우: 기술규칙 → 아트디렉션 → 스토리보드 → 에셋스펙 → 에셋생성 → 모션프리미티브 → 준비 → 조립 → 씬생성
- 핵심: 각 단계를 마크다운 파일로 만들어서 AI에게 구조화된 컨텍스트 제공
- "관심사 분리"로 AI가 한 번에 너무 많은 걸 추측하지 않게 함
