# Remotion 영상 디자인 가이드

> **용도**: 모든 Remotion 영상 제작 시 참조. 교육/브랜드/데이터 시각화 영상 공통.
> **출처**: RinDig, creativly.ai, remotion-dev 공식, Andy Lo, prompt-to-video 등 6개 레퍼런스 분석 (2026-04-12)
> **핵심 원칙**: "슬라이드쇼가 아니라 영상을 만들어라"

---

## 1. 현재 진단 — 왜 30점이었나

### 문제 목록
1. **장면 시작 → 전부 등장 → 정지**: 요소가 한번에 나오고 10~20초 동안 움직임 없음. 음성만 흘러감
2. **음성-화면 싱크 없음**: "3초"라고 말하는 시점과 "3초" 텍스트 등장 시점이 무관
3. **정보 과밀**: 한 화면에 텍스트 3~4줄 + 서브 + 이모지. 모바일에서 읽기 힘듦
4. **정적 배경**: 단색 배경에 글자만 바뀜. 화면이 "죽어있음"
5. **의미 없는 장식**: 배경에 무의미한 블록 배치. 내용과 무관한 장식은 노이즈
6. **교안 구조 노출**: [공감], [원리], [전환] 같은 구간 라벨이 보이는 느낌. 강사 교안을 그대로 옮김
7. **폰트 크기 반복 위반**: 52px 미만 텍스트가 계속 등장. 강제 검증 안 함

### 근본 원인
- 코딩(엔지니어) 모드에서 콘텐츠(크리에이터) 모드로 전환 없이 작업
- CLAUDE.md 규칙을 코딩 전에 안 읽음
- 스펙(BEATS) 없이 바로 코딩 → "일단 돌아가게" 만들고 비주얼은 후순위
- 셀프 검수를 안 하거나, 했어도 빈 화면을 그대로 제출

---

## 2. 핵심 원리 — 레퍼런스에서 배운 것

### 원리 1: 한 화면 = 한 아이디어
- 정보 밀도를 극도로 낮출 것. 한 장면에 **텍스트 1~2줄 + 비주얼 1개**
- 복잡한 설명은 여러 장면으로 쪼개서 순차 공개
- "이걸 다 보여줘야 해"가 아니라 "이 순간에 뭘 느끼게 할까"

### 원리 2: BEATS — 장면 안의 타임라인
- 장면 하나 = 정적 슬라이드가 아님. **12~20개 이벤트**가 순차 발생
- 모든 요소는 **등장(enter) → 유지(idle) → 강조(highlight) → 퇴장(exit)** 생명주기를 가짐
- 장면당 BEATS 상수 정의 필수:
```typescript
const BEATS = {
  EMOJI_IN: 0,        // 이모지 등장
  HEADLINE_IN: 5,     // 제목 등장
  SUB_IN: 15,         // 서브 텍스트
  HIGHLIGHT: 45,      // 핵심 단어 색상 변경
  ACCENT_GLOW: 50,    // 배경 글로우 확대
  DIM_OTHERS: 70,     // 나머지 요소 어두워짐
  EXIT_START: 85,     // 페이드아웃 시작
};
```

### 원리 3: 음성 = 화면의 지휘자
- 음성이 "3초"라고 말하는 프레임 = "3초" 텍스트가 나타나는 프레임
- Whisper/Gemini 타임스탬프 → ms→frame 변환 → BEATS 값으로 사용
- **음성보다 먼저 정보 노출 절대 금지** (CLAUDE.md 기존 규칙)
- **음성보다 너무 늦게 나와도 안 됨** — ±3프레임(0.1초) 이내

### 원리 4: 의미 있는 애니메이션만
- 모든 움직임은 **내용을 설명하는 역할**이어야 함
- "벽이 무너지는 애니메이션" = 경계심이 무너지는 내용일 때만
- 배경 파티클/글로우 = 화면이 "살아있는" 느낌 (미묘하게, 콘텐츠 방해 않는 수준)
- 의미 없는 반복 루프, 장식용 블록 금지

### 원리 5: 후킹을 가르치는 영상은 후킹으로 시작
- "가르치는 영상"이 아니라 "보여주는 영상"
- 원리를 설명하는 대신 **사례 안에 원리를 녹임**
- 구간 라벨([공감], [원리]) 보이면 안 됨 — 시청자는 이야기 흐름만 느껴야
- 첫 1초부터 이 영상 자체가 주제를 실행해야 함

### 원리 6: 스펙이 핵심
> "The hard work isn't the AI. It's the spec." — RinDig

- 프레임 단위 스펙 없이 코딩하면 → "일단 보이게" 만들고 끝
- 스펙이 상세할수록 AI 출력 품질이 올라감
- 좋은 스펙: 프레임 범위 + 정확한 컴포넌트명 + props 값 + 색상 hex + spring config
- 나쁜 스펙: "텍스트가 페이드 인", "뭔가 강조"

---

## 3. 컴포넌트 카탈로그 — 도입할 것들

### 텍스트 애니메이션 (최우선)

**CharacterReveal** — 글자별 spring 등장
- 용도: 키워드, 상품명, 숫자 등장
- 패턴: 글자마다 `spring(frame - delay - i * stagger)` 적용
- opacity + translateY + blur 동시 변화
- gradient 옵션으로 그라디언트 텍스트 가능

**KineticType** — 단어별 독립 위치/크기 + noise2D 흔들림
- 용도: 임팩트 있는 키메시지
- 패턴: 단어마다 다른 x, y, fontSize, color 지정
- noise2D로 미세한 유기적 흔들림 추가 (noiseIntensity: 3~5px)
- 정적 텍스트와 완전히 다른 "살아있는" 느낌

**WordHighlight** — 핵심 단어 배경 바 확장
- 용도: 화법에서 강조할 단어 (예: "질문", "3초")
- 패턴: scaleX spring으로 왼→우 확장 + skewX로 기울기
- transformOrigin: "left center"

**Typewriter** — 타이핑 효과
- 용도: 화법 인용, 터미널 느낌의 텍스트
- 패턴: `text.slice(0, Math.floor(frame * charsPerFrame))`
- 커서 깜빡임: `frame % 16` 으로 opacity 토글

**BlurText** — 단어별 블러 리빌 (RinDig 클로징 시그니처)
- 용도: 모든 영상 마무리 핵심 메시지
- 패턴: animateBy="words", direction="bottom", staggerDelay=4
- 핵심 줄만 accent 색상

### 배경/분위기

**AuroraBackground** — 여러 gradient blob이 sin/cos로 공전
- 용도: 고급스러운 배경 (인트로, 마무리)
- 패턴: 3~5개 radial-gradient blob + blur(80px) + 느린 이동
- 콘텐츠 방해 않는 낮은 opacity (0.3~0.5)

**ParticleField** — 결정론적 파티클
- 용도: 모든 장면의 미묘한 배경 움직임
- 패턴: seededRandom으로 위치 결정 (렌더링마다 동일)
- sin/cos drift로 천천히 떠다님
- 60개 파티클, opacity 0.1~0.3

**GlowOrb** — 배경 원형 글로우
- 용도: 키워드 장면의 배경 강조
- 패턴: radial-gradient + sin 파동 스케일
- accent 색상, opacity 4~6%

### 구조/효과

**GlowingStroke** — SVG 테두리 드로잉
- 용도: 카드 등장, 비교 카드 강조
- 패턴: SVG rect + strokeDasharray/strokeDashoffset
- 선이 사각형을 돌며 그려지는 효과

**카메라 줌** — 전체 장면 서서히 확대
- 용도: 모든 장면에 미묘하게 적용 (1.0 → 1.03~1.06)
- 패턴: AbsoluteFill에 `transform: scale(${sceneScale})`
- Easing.out(Easing.quad)로 감속

**컬러 플래시 전환** — 챕터 구분
- 용도: 섹션 전환 시 0.5~1초 단색 플래시
- 패턴: accent 색상 AbsoluteFill + fade in/out
- 슬라이드쇼 느낌 없애는 간단하고 효과적인 방법

### 전환

**슬라이드 전환** (Transition.tsx 패턴)
- translateX spring으로 좌→우 or 우→좌
- in/out 래퍼로 감싸서 양방향
- damping: 80 (살짝 부드럽게)

**장면 오버랩**
- Sequence from 값을 겹치게 설정
- 이전 장면 페이드아웃 + 새 장면 슬라이드인 동시 진행
- "딱딱 끊기는" 느낌 제거

**블러 전환** (template-prompt-to-video)
- 입장: blur(25px) → blur(0)
- 퇴장: blur(0) → blur(25px)
- 1000ms (30프레임) 동안

---

## 4. 스펙 작성 가이드

### 스펙 파일 구조 (RinDig 기반, 우리 교육 영상에 맞게 조정)

```markdown
# 에피소드: [제목]

## 메타
- ID: LE-XX
- 카테고리: L/I/N/K
- 길이: XX초 / XXXX프레임
- 해상도: 1080x1920 @ 30fps
- 팔레트: orange (다크 + 주황 강조)
- 핵심 메시지: [한 문장]
- 음성 파일: audio/link-edu-xxx.wav

## Color Flow
| 장면 | 지배 색상 | 감정 |
|------|----------|------|
| 도입 | accent(주황) | 궁금증, 긴장 |
| 사례 | sub(회색) | 공감, 관찰 |
| 핵심 | accent(주황) | 깨달음 |
| 비교 | wrongRed / rightGreen | 대비 |
| 마무리 | accent(주황) + glow | 여운 |

## 장면별 스펙

### Scene 1: [이름] (0s~5s, frames 0~150)

**나레이션:** > "정확한 보이스오버 텍스트"

**비주얼:**
- **Frames 0~5**: 배경 글로우 fade in (accent, 5% opacity)
- **Frames 5~8**: 이모지 🤔 scale spring (bouncy)
- **Frames 8~15**: 헤드라인 "귓구멍을 파라고 해요?" CharacterReveal
- **Frames 30~45**: "파라고" WordHighlight (accent 배경 바)
- **Frames 45~60**: 나머지 텍스트 dim (opacity 0.4)
- **Frames 85~100**: 전체 fade out

**BEATS:**
```typescript
const BEATS = {
  GLOW_IN: 0,
  EMOJI_IN: 5,
  HEADLINE_REVEAL: 8,
  WORD_HIGHLIGHT: 30,
  DIM_OTHERS: 45,
  FADE_OUT: 85,
};
```

**컴포넌트:** CharacterReveal, WordHighlight, GlowOrb
**배경:** dark (#0B1120) + accent glow
```

### 나쁜 스펙 vs 좋은 스펙

| 나쁜 스펙 | 좋은 스펙 |
|---------|---------|
| "텍스트가 페이드 인" | `CharacterReveal text="3초" delay={5} stagger={2} blur gradient` |
| "뭔가 강조" | `WordHighlight word="질문" color="#FF8C38" delay={30} skew={-3}` |
| 장면당 3~5 이벤트 | **장면당 12~20 BEATS** |
| 산문에 타이밍 섞임 | BEATS 상수 + 프레임 범위 명시 |
| "배경 어둡게" | `#0B1120` + `GlowOrb x="50%" y="40%" color="#FF8C38" opacity={0.05}` |

---

## 5. 디자인 시스템

### 색상 — 시맨틱 이름 사용

```typescript
// 교육 영상 시맨틱 색상
const SEMANTIC_COLORS = {
  // 배경
  bgDark: "#0B1120",         // 기본 배경
  bgSurface: "#151B2E",      // 카드/패널 배경

  // 텍스트
  textBright: "#F0F0F0",     // 메인 텍스트
  textMuted: "#8899AA",      // 보조 텍스트
  textDim: "#556677",        // 약한 텍스트

  // 기능별 (내용의 의미에 따라)
  hookOrange: "#FF8C38",     // 후킹 포인트, 핵심 인사이트, "아하" 순간
  wrongRed: "#E05A5A",       // 잘못된 화법, 실수
  rightGreen: "#4ECDC4",     // 올바른 화법, 해결
  insightBlue: "#5b9bd5",    // 분석, 데이터, 깨달음
  warmGold: "#C9A227",       // 역사, 인용, 따뜻한 감정
};
```

### 타이포그래피

| 역할 | 크기 | 무게 | 비고 |
|------|------|------|------|
| 히어로 키워드 | 140~200px | 900 | 장면 중심 단어 |
| 헤드라인 | 100px | 900 | 장면 제목 |
| 본문/화법 | 64~72px | 700 | 대화, 설명 |
| 서브/캡션 | 60px | 600 | 보조 설명 (절대 52 미만 금지) |
| 헤더 라벨 | 56px | 800 | L단계 등 네비게이션 |
| 이모지 | 120~160px | - | 비주얼 앵커 |

**그라디언트 텍스트 패턴:**
```css
background: linear-gradient(135deg, #FF8C38, #FFB070);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
padding: 0.15em 0.3em;  /* 클리핑 잘림 방지 필수 */
```

### Spring 프리셋

| 이름 | config | 용도 |
|------|--------|------|
| instant | `{ damping: 200 }` | 배경, 페이드, 부드러운 진입 |
| smooth | `{ damping: 12 }` | 텍스트 등장 |
| snap | `{ damping: 14, stiffness: 120, mass: 0.4 }` | UI 요소, 빠른 등장 |
| bouncy | `{ damping: 8 }` | 임팩트, 이모지 |
| heavy | `{ damping: 12, stiffness: 80, mass: 0.6 }` | 로고, 큰 요소 |

### 타이밍 (30fps 기준)

| 동작 | 프레임 | 초 |
|------|--------|-----|
| 요소 등장 (spring) | 3~8 | 0.1~0.27초 |
| stagger 간격 | 3~5 | 0.1~0.17초 |
| 장면 fade in | 10~15 | 0.33~0.5초 |
| 장면 fade out | 15~20 | 0.5~0.67초 |
| 장면 간 갭 | 21 | 0.7초 |
| WordHighlight 확장 | 15~20 | 0.5~0.67초 |
| 카메라 줌 (전체) | 장면 전체 | 1.0→1.05 |
| 클로징 홀드 | 60+ | 2초+ |

---

## 6. 대본 작성 규칙

### 톤
- 강의체 금지 → 대화체 ("~거든요", "~잖아요")
- 이론 설명 금지 → 사례 안에 원리 녹이기
- "이번 파트에서는..." 금지 → 바로 이야기 시작
- 구간 라벨 금지 → 시청자는 흐름만 느끼게

### 구조
- **첫 1초**: 이 에피소드의 주제를 "실행"하는 것으로 시작 (후킹 에피소드면 후킹으로 시작)
- **사례 → 원리**: 원리를 먼저 말하고 사례를 보여주지 않음. 사례를 보여주고 원리가 자연스럽게 드러나게
- **비유는 원본 것 살리되** 더 짧고 펀치감 있게 (구찌/MCM, 옷장, 수도꼭지)
- **한 에피소드 = 한 메시지**: "이거 내일 써봐야지" 하나면 성공

### 텍스트 화면 규칙
- 한 화면에 **최대 2줄**
- 문장이 아니라 **키워드**
- 긴 설명은 음성이 담당, 화면은 핵심만
- 음성과 화면 텍스트가 **다른 내용이어도 됨** — 음성이 설명하고 화면은 감정/비유를 보여줄 수 있음

---

## 7. 시리즈 통일 요소

### 고정 헤더 (모든 장면)
- 상단에 카테고리(L단계) + 소제목(왜 후킹인가) 고정
- 주황 키컬러 라인
- 프로그레스 바

### 타이틀 카드 (모든 에피소드 시작, 1.5초)
- 카테고리 뱃지 (주황) + 제목 (100px) + "LINK Consulting"
- 구분선

### 클로징 시그니처 (모든 에피소드 끝, 5초)
- 모든 요소 fade out → 어두운 배경 → 20프레임 여백
- BlurText로 핵심 메시지 1~2줄 리빌
- 핵심 단어 accent(주황) 색상
- accent 글로우 (4~5% opacity, ~400px radius)
- 60프레임+ 클린 홀드
- "다음 편: [제목]" 서브 텍스트

### 다크↔라이트 교차 (선택)
- 기본 다크 배경
- 섹션 전환 시 라이트 배경 장면 1~2개 삽입 → 지루함 방지
- 라이트: #FAFAFA 배경 + 어두운 텍스트

---

## 8. 확장 — 교육 외 활용

### 데이터 시각화 영상
- CountUp + 막대 차트 stagger + 파이 차트 strokeDashoffset
- 매월 실적/성과를 자동 영상으로 (GitHub Unwrapped 패턴)
- timeline.json 구조로 데이터→영상 자동화

### 브랜드/홍보 영상
- KineticType + AuroraBackground + GlowingStroke
- 카메라 줌 + 컬러 플래시 전환
- 다크 배경 + 그라디언트 텍스트

### 상품 소개 영상
- FlowNode + FlowEdge 패턴으로 보장 흐름도
- BrowserWindow 프레임으로 화면 시뮬레이션
- 비교 데이터: 스케일 비교 (지구-화성 패턴 → 보장금액 비교)

### 자동화 파이프라인 (장기)
- prompt-to-motion-graphics의 Skill Detection 패턴
- 프롬프트 분석 → 적합한 skill 자동 선택 → 코드 생성
- 월간 보고서, 신상품 소개 등 반복 콘텐츠에 적합

---

## 9. 레퍼런스 출처

| 레포/영상 | 핵심 배운 점 | URL |
|----------|-------------|-----|
| RinDig/Content-Agent-Routing-Promptbase | BEATS, 스펙 포맷, 4계층 라우팅, 디자인 시스템 | github.com/RinDig/Content-Agent-Routing-Promptbase |
| naveen-annam/creativly.ai-brand-video-remotion | KineticType, CharacterReveal, WordHighlight, Aurora, seededRandom | github.com/naveen-annam/creativly.ai-brand-video-remotion |
| remotion-dev/trailer | GlowingStroke, 전환 래퍼, stagger, SVG 드로잉, 컬러 플래시 | github.com/remotion-dev/trailer |
| remotion-dev/template-prompt-to-motion-graphics-saas | Skill 시스템, 타이포 패턴, 차트 패턴 | github.com/remotion-dev/template-prompt-to-motion-graphics-saas |
| remotion-dev/template-prompt-to-video | ms→frame 파이프라인, blur 전환, fitText, 자막 싱크 | github.com/remotion-dev/template-prompt-to-video |
| Andy Lo (YouTube) | 컴포넌트 레지스트리 개념, 스타일 가이드, 스펙 드리븐 워크플로우 | youtube.com/watch?v=xAUifztpib8 |

---

## 10. 체크리스트 — 코딩 전 확인

- [ ] 스펙(BEATS) 작성했는가? 장면당 12개 이상 이벤트?
- [ ] 음성 타임스탬프 → BEATS 프레임으로 변환했는가?
- [ ] 한 화면 텍스트 2줄 이내인가?
- [ ] 모든 폰트 52px 이상인가?
- [ ] 요소의 생명주기(enter→idle→highlight→exit)가 있는가?
- [ ] 배경에 미묘한 움직임(글로우, 파티클)이 있는가?
- [ ] 의미 없는 장식은 없는가?
- [ ] 카메라 줌(1.0→1.05) 적용했는가?
- [ ] 클로징이 시그니처 패턴(BlurText + glow + 홀드)을 따르는가?
- [ ] 다크 배경 + 주황 키컬러 일관성 유지되는가?
