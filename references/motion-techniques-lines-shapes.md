---
date: 2026-04-02
purpose: "선과 면"으로 감정/상황(거절, 좌절, 실패)을 표현하는 코드 기반 모션그래픽 기법 조사
---

# 코드 기반 모션그래픽: 선과 면으로 감정 표현하기

## 1. 벽돌/블록이 쌓이다가 벽에 막히는 모션

### Remotion에서 구현하는 방법

순수 `interpolate()` + `spring()`으로 충분히 구현 가능. 물리엔진 불필요.

```tsx
// 블록이 하나씩 쌓이는 패턴
const blocks = [0, 1, 2, 3, 4];

blocks.map((i) => {
  const delay = i * 8; // 8프레임 간격으로 스태거
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  // 위에서 떨어져서 제자리에 안착
  const y = interpolate(progress, [0, 1], [-(i + 1) * 120, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{
      transform: `translateY(${y}px)`,
      opacity,
      position: 'absolute',
      bottom: i * 100, // 아래부터 쌓임
    }}>
      {/* 블록 내용 */}
    </div>
  );
});
```

### "벽에 막히는" 표현

```tsx
// 마지막 블록이 올라가다가 빨간 벽에 부딪혀 멈추는 모션
const wallHitFrame = 45;
const lastBlockY = interpolate(
  frame,
  [30, wallHitFrame, wallHitFrame + 3, wallHitFrame + 6],
  [-200, 0, -15, 0], // 부딪히고 살짝 튕김
  { extrapolateRight: 'clamp' }
);

// 벽에 부딪히는 순간 흔들림(shake)
const shakeX = frame > wallHitFrame && frame < wallHitFrame + 10
  ? Math.sin((frame - wallHitFrame) * 3) * 5 * Math.exp(-(frame - wallHitFrame) * 0.3)
  : 0;
```

**핵심**: spring의 damping을 높이면 탁 멈추는 느낌, 낮추면 통통 튀는 느낌.

---

## 2. 쌓은 것이 와르르 무너지는 모션

### 방법 A: 물리엔진 없이 — 스태거 + 랜덤 회전 (추천)

물리 시뮬레이션 없이도 "무너지는 느낌"은 충분히 낼 수 있음.

```tsx
// 무너지는 블록들
const collapseStart = 60; // 무너지기 시작하는 프레임

blocks.map((i) => {
  const staggerDelay = i * 3; // 위쪽 블록부터 먼저 무너짐 (역순)
  const collapseFrame = frame - collapseStart - staggerDelay;

  // 각 블록마다 랜덤한 방향으로 떨어짐
  const directions = [-1, 1, -0.5, 1.5, -1.2]; // 미리 정해둔 방향
  const rotations = [15, -20, 30, -10, 25]; // 미리 정해둔 회전각

  const fallProgress = spring({
    frame: collapseFrame,
    fps,
    config: { damping: 8, mass: 1.5 }, // 무거운 느낌
  });

  const x = interpolate(fallProgress, [0, 1], [0, directions[i] * 200]);
  const y = interpolate(fallProgress, [0, 1], [0, 600]); // 아래로 떨어짐
  const rotate = interpolate(fallProgress, [0, 1], [0, rotations[i]]);
  const opacity = interpolate(fallProgress, [0.7, 1], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <div style={{
      transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
      opacity,
    }} />
  );
});
```

### 방법 B: Matter.js "Baking" 패턴 (복잡한 물리가 필요할 때)

Matter.js 시뮬레이션을 미리 돌려서 각 프레임의 위치/회전값을 배열로 저장(bake)한 뒤,
Remotion에서는 그 배열을 `frame` 인덱스로 읽기만 하는 방식.

```tsx
// 1단계: 시뮬레이션 베이킹 (빌드 시 한 번만 실행)
import Matter from 'matter-js';

function bakeSimulation(totalFrames: number) {
  const engine = Matter.Engine.create();
  const bodies = [/* 블록들 생성 */];
  const frames: Array<Array<{x: number, y: number, angle: number}>> = [];

  for (let i = 0; i < totalFrames; i++) {
    Matter.Engine.update(engine, 1000 / 30); // 30fps 기준
    frames.push(bodies.map(b => ({
      x: b.position.x,
      y: b.position.y,
      angle: b.angle,
    })));
  }
  return frames;
}

// 2단계: Remotion 컴포넌트에서 사용
const bakedData = bakeSimulation(90);

const MyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const positions = bakedData[frame] || bakedData[bakedData.length - 1];

  return positions.map((pos, i) => (
    <div style={{
      transform: `translate(${pos.x}px, ${pos.y}px) rotate(${pos.angle}rad)`,
    }} />
  ));
};
```

**참고 레포**: [hylarucoder/remotion-physics](https://github.com/hylarucoder/remotion-physics) — Matter.js + Remotion 통합 예제 (Pool Game, Physics Animation)

**remotion-dev 공식 논의**: [Physics Engine, Baking Discussion #4373](https://github.com/orgs/remotion-dev/discussions/4373)

### 방법 C: CSS Stagger만으로 간단하게

```css
/* 각 블록에 다른 animation-delay */
.block:nth-child(1) { animation-delay: 0s; }
.block:nth-child(2) { animation-delay: 0.1s; }
.block:nth-child(3) { animation-delay: 0.2s; }

@keyframes collapse {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(300px) rotate(15deg); opacity: 0; }
}
```

참고: [Staggering Animations - CSS-Tricks](https://css-tricks.com/staggering-animations/)

---

## 3. 거절/실패/좌절을 도형으로 표현하는 기법

### 3-1. 선이 끊기기 (Line Break)

SVG `stroke-dashoffset` + `stroke-dasharray`로 선이 그려지다가 중간에서 끊기는 표현.

```tsx
// 선이 진행하다가 중간에서 끊어짐
const lineLength = 500;
const drawProgress = interpolate(frame, [0, 30], [lineLength, lineLength * 0.4], {
  extrapolateRight: 'clamp',
});

// 끊어지는 순간 갭이 벌어짐
const gapSize = frame > 30
  ? interpolate(frame, [30, 45], [0, 80], { extrapolateRight: 'clamp' })
  : 0;

<svg>
  {/* 왼쪽 선 */}
  <line x1={0} y1={100} x2={250 - gapSize} y2={100}
    stroke="#fff" strokeWidth={4}
    strokeDasharray={lineLength}
    strokeDashoffset={drawProgress} />
  {/* 오른쪽 선 — 끊어진 후 아래로 떨어짐 */}
  <line x1={250 + gapSize} y1={100 + (frame > 35 ? (frame - 35) * 2 : 0)}
    x2={500} y2={100 + (frame > 35 ? (frame - 35) * 2 : 0)}
    stroke="#fff" strokeWidth={4} opacity={frame > 30 ? 1 : 0} />
</svg>
```

참고: [How SVG Line Animation Works - CSS-Tricks](https://css-tricks.com/svg-line-animation-works/), [vivus.js](https://maxwellito.github.io/vivus/)

### 3-2. 원이 깨지기 (Circle Crack/Shatter)

`clip-path`로 원을 여러 조각으로 쪼개서 흩어지는 표현.

```tsx
// 원이 4조각으로 갈라짐
const crackProgress = spring({
  frame: frame - crackFrame,
  fps,
  config: { damping: 10 },
});

const pieces = [
  { clipPath: 'polygon(50% 50%, 0 0, 50% 0)', tx: -30, ty: -30, rotate: -15 },
  { clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)', tx: 30, ty: -20, rotate: 10 },
  { clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)', tx: 25, ty: 35, rotate: 20 },
  { clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 50%)', tx: -35, ty: 25, rotate: -25 },
];

pieces.map((piece) => (
  <div style={{
    width: 200, height: 200,
    borderRadius: '50%',
    background: '#E74C3C',
    clipPath: piece.clipPath,
    transform: `translate(${piece.tx * crackProgress}px, ${piece.ty * crackProgress}px) rotate(${piece.rotate * crackProgress}deg)`,
    opacity: interpolate(crackProgress, [0.6, 1], [1, 0], { extrapolateLeft: 'clamp' }),
  }} />
));
```

참고: [Animating with Clip-Path - CSS-Tricks](https://css-tricks.com/animating-with-clip-path/), [CSS Shatter Effect CodePen](https://codepen.io/Lawrie/pen/BjmVBO)

### 3-3. 막대가 꺾이기 (Bar Snap)

진행 막대가 차오르다가 꺾이면서 아래로 떨어지는 표현.

```tsx
// 막대가 80%까지 차오른 후 꺾임
const fillWidth = interpolate(frame, [0, 40], [0, 80], { extrapolateRight: 'clamp' });

const snapFrame = 45;
const snapProgress = frame > snapFrame
  ? spring({ frame: frame - snapFrame, fps, config: { damping: 8 } })
  : 0;

// 꺾이는 지점에서 막대가 두 동강
const breakPoint = 60; // %
const rightPartAngle = interpolate(snapProgress, [0, 1], [0, 45]);
const rightPartY = interpolate(snapProgress, [0, 1], [0, 100]);

<div style={{ position: 'relative' }}>
  {/* 왼쪽 (살아남은 부분) */}
  <div style={{ width: `${Math.min(fillWidth, breakPoint)}%`, height: 40, background: '#3498DB' }} />
  {/* 오른쪽 (꺾여서 떨어지는 부분) */}
  <div style={{
    width: `${Math.max(fillWidth - breakPoint, 0)}%`,
    height: 40,
    background: '#E74C3C',
    transformOrigin: 'left center',
    transform: `rotate(${rightPartAngle}deg) translateY(${rightPartY}px)`,
    opacity: interpolate(snapProgress, [0.5, 1], [1, 0.3], { extrapolateLeft: 'clamp' }),
  }} />
</div>
```

### 3-4. X 표시 슬래시 (거절의 직접적 표현)

```tsx
// 대각선 두 줄이 교차하며 X 그리기
const line1 = spring({ frame: frame - startFrame, fps, config: { damping: 15 } });
const line2 = spring({ frame: frame - startFrame - 5, fps, config: { damping: 15 } });

<svg width={200} height={200}>
  <line x1={20} y1={20} x2={20 + 160 * line1} y2={20 + 160 * line1}
    stroke="#E74C3C" strokeWidth={8} strokeLinecap="round" />
  <line x1={180} y1={20} x2={180 - 160 * line2} y2={20 + 160 * line2}
    stroke="#E74C3C" strokeWidth={8} strokeLinecap="round" />
</svg>
```

### 3-5. 도형 수축/소멸 (희망이 사라지는 표현)

```tsx
// 원이 점점 작아지면서 사라짐
const shrink = interpolate(frame, [startFrame, startFrame + 30], [1, 0], {
  extrapolateRight: 'clamp',
  easing: Easing.bezier(0.4, 0, 1, 1), // ease-in — 점점 빨라짐
});

<div style={{
  width: 200, height: 200,
  borderRadius: '50%',
  background: 'rgba(255,255,255,0.2)',
  transform: `scale(${shrink})`,
}} />
```

---

## 4. 애니메이션 라이브러리 Remotion 호환성 정리

| 라이브러리 | Remotion 호환 | 비고 |
|-----------|-------------|------|
| **Remotion spring()** | 네이티브 | 기본 내장. 대부분의 모션은 이것으로 충분 |
| **Remotion interpolate()** | 네이티브 | spring()과 조합해서 사용 |
| **react-spring** | 비호환 | 시간 기반 애니메이션이라 Remotion의 프레임 기반과 충돌 |
| **framer-motion** | 비호환 | 같은 이유. 공식 통합 논의 중이나 아직 없음 |
| **Matter.js** | 조건부 호환 | "Baking" 패턴으로 사용 가능. 시뮬레이션을 미리 돌려서 위치값 배열로 저장 후 frame 인덱스로 읽기 |
| **Anime.js v4** | 조건부 호환 | CSS animation-delay/play-state로 동기화 가능. [Remotion + Anime.js 예제](https://revidcraft.com/posts/remotion-part-02) |
| **GSAP** | 비호환 | 시간 기반. Remotion과 직접 통합 어려움 |
| **CSS Keyframes** | 호환 | animation-delay와 animation-play-state로 Remotion 타임라인과 동기화 |
| **SVG stroke 애니메이션** | 호환 | strokeDashoffset을 frame 기반으로 직접 제어하면 완벽 동기화 |
| **clip-path 애니메이션** | 호환 | 인라인 스타일로 frame 기반 제어 가능 |

### 핵심 원칙

> Remotion에서 모든 애니메이션은 `useCurrentFrame()`이 반환하는 값으로 구동되어야 한다.
> 시간 기반 라이브러리(framer-motion, react-spring, GSAP)는 직접 호환 불가.
> 프레임 값을 입력으로 받아 위치/크기/투명도를 계산하는 방식만 동작함.

---

## 5. 참고할 CodePen / 데모 목록

### 떨어지는/쌓이는 모션
- [Element Falling Animation](https://codepen.io/furat/pen/PGwzGx) — CSS translateY 기반
- [Falling Block Loading](https://codepen.io/Keale2/pen/vNKrzx) — SASS + ease-in 낙하
- [Matter.js Falling Particles](https://codepen.io/tommyho/pen/gOQBVwb) — 중력 회전 시뮬레이션
- [Pure CSS Physics Falling (linear() easing)](https://codepen.io/tomhermans/pen/NWeagmy) — 물리엔진 없이 CSS만으로

### 깨지는/부서지는 모션
- [CSS Shatter Effect](https://codepen.io/Lawrie/pen/BjmVBO) — SCSS 그리드 기반 파편화
- [Shattering Text Animation](https://codepen.io/ARS/pen/pjypwd) — SVG + GSAP 파편
- [Canvas Shatter Effect](https://codepen.io/cjgammon/pen/QWJKXg) — Canvas 기반
- [CSS Breaking Heart](https://codepen.io/demps_sean/pen/EaKLYM) — 하트가 갈라지는 애니메이션
- [Clip-Path Animation](https://codepen.io/danwilson/pen/GWeboe) — clip-path 변형

### SVG 선 애니메이션
- [vivus.js 데모](https://maxwellito.github.io/vivus/) — SVG 선 그리기 라이브러리
- [SVG Line Drawing - CSS-Tricks](https://css-tricks.com/svg-line-animation-works/) — stroke-dashoffset 원리 설명
- [Line Drawing with Snap.svg](https://codepen.io/fartymonk/pen/woNLvg)

### 스태거/물리 흉내
- [Staggering Animations - CSS-Tricks](https://css-tricks.com/staggering-animations/)
- [Spring Animation in CSS (Medium)](https://medium.com/@dtinth/spring-animation-in-css-2039de6e1a03) — CSS로 스프링 흉내
- [css-spring (GitHub)](https://github.com/codepunkt/css-spring) — CSS 키프레임으로 물리 스프링 생성

### Remotion 관련
- [remotion-physics](https://github.com/hylarucoder/remotion-physics) — Matter.js + Remotion 통합 예제
- [Remotion Third Party Integrations 공식 문서](https://www.remotion.dev/docs/third-party)
- [Remotion spring() 공식 문서](https://www.remotion.dev/docs/spring)
- [Remotion interpolate() 공식 문서](https://www.remotion.dev/docs/interpolate)
- [Remotion + Anime.js 튜토리얼](https://revidcraft.com/posts/remotion-part-02)

---

## 6. 실전 권장: "거절/좌절" 장면 구현 전략

우리 영상에서 쓸 때의 추천 조합:

### 시나리오: "열심히 쌓았는데 거절당함"
1. **블록 쌓기** (0~2초): spring + stagger로 블록 4~5개 아래부터 쌓임
2. **벽에 부딪힘** (2~2.5초): 마지막 블록이 빨간 벽에 부딪혀 shake
3. **무너짐** (2.5~4초): 각 블록에 랜덤 방향 + 회전 + fadeOut (물리엔진 불필요)
4. **X 표시 또는 선 끊김** (4~5초): 마무리 강조

### 시나리오: "진행하다가 실패"
1. **선이 그려짐** (SVG stroke-dashoffset) — 진행 표현
2. **선이 중간에서 끊어짐** — 갭이 벌어지면서 오른쪽 조각 낙하
3. **원이 깨짐** (clip-path 조각) — 실패/좌절 강조

### 핵심: Matter.js는 아직 안 써도 됨
- 위의 모든 효과는 Remotion의 `spring()` + `interpolate()` + SVG + `clip-path`로 구현 가능
- Matter.js는 10개 이상의 물체가 서로 충돌하며 자연스럽게 쌓이는 경우에만 필요
- 5개 이하의 블록이 무너지는 정도는 미리 정한 방향값으로 충분히 자연스러움
