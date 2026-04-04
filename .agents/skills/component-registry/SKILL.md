---
name: component-registry
description: Component architecture patterns for Remotion video production — reusable text, containers, effects, backgrounds, and visual patterns. Build once, compose forever.
metadata:
  tags: components, react, reusable, effects, text, animation, patterns, remotion
---

## When to use

Use this skill when building or composing Remotion scenes. Check this registry before building from scratch. It covers the shared components in `src/components/` and patterns for creating new ones.

---

## Architecture

```
src/
├── constants.ts              # Colors, timing, springs, easing (central config)
├── components/               # Shared across ALL videos
│   ├── GradientBackground.tsx  # Background + radial gradient
│   ├── SceneHeadline.tsx       # Top headline with accent color
│   ├── FadeInText.tsx          # Opacity + translateY entrance
│   ├── FragmentEffect.tsx      # clipPath-based shatter/fall effect
│   └── NetworkGraph.tsx        # SVG dot-line connection animation
└── [VideoName].tsx           # Individual video compositions
```

### Rules

1. **Check this registry before building.** If a component exists, use it.
2. **Import constants** from `src/constants.ts` — never hardcode colors, springs, or timing.
3. **Components are frame-driven.** They use `useCurrentFrame()` internally. Never CSS animations.
4. **Prefer composition over inheritance.** Combine small components.

---

## Shared Components

### GradientBackground

Dark background with radial gradient glow. Used in every video.

```tsx
import { GradientBackground } from './components/GradientBackground';

// Use palette name from constants.ts
<GradientBackground palette="blue" />
<GradientBackground palette="orange" />
<GradientBackground palette="pink" />

// Or custom colors
<GradientBackground
  bgColor="#0c1117"
  glowColor="rgba(91, 155, 213, 0.05)"
  glowPosition="50% 40%"
/>
```

### SceneHeadline

Top-positioned headline text at SAFE.top + 40, centered, accent color, 72px bold.

```tsx
import { SceneHeadline } from './components/SceneHeadline';

<SceneHeadline text="만남을 꺼림" opacity={headlineOpacity} />
<SceneHeadline text="의리가입 종말" opacity={headlineOpacity} accentColor={P.accent} />
```

### FadeInText

Standard text entry: opacity 0→1 + translateY 20px→0 with spring.

```tsx
import { FadeInText } from './components/FadeInText';

// Basic
<FadeInText delay={15}>설명 텍스트</FadeInText>

// With custom spring
<FadeInText delay={30} springConfig={{ damping: 12 }} fontSize={56}>
  큰 텍스트
</FadeInText>
```

### FragmentEffect

clipPath-based shatter/fall effect for breaking apart elements.

```tsx
import { FragmentEffect } from './components/FragmentEffect';

<FragmentEffect
  breakStart={45}   // frame when break begins
  fragments={[
    { tx: -120, ty: 350, rot: -35 },
    { tx: 80, ty: 400, rot: 25 },
    { tx: -50, ty: 550, rot: -60 },
  ]}
>
  <div>This content will shatter</div>
</FragmentEffect>
```

### NetworkGraph

SVG dot-and-line connection animation for relationship/network visualizations.

```tsx
import { NetworkGraph } from './components/NetworkGraph';

<NetworkGraph
  nodes={[
    { x: 200, y: 400, label: "고객" },
    { x: 540, y: 960, label: "설계사" },
    { x: 880, y: 400, label: "회사" },
  ]}
  edges={[
    { from: 0, to: 1 },
    { from: 1, to: 2 },
  ]}
  accentColor="#4A9EFF"
/>
```

---

## Patterns for Common Scenes

### [키워드 강조] — Keyword Emphasis

```tsx
<GradientBackground palette="blue" />
<SceneHeadline text="핵심 키워드" opacity={headlineOpacity} />
<FadeInText delay={15} fontSize={80} fontWeight={800}>
  강조할 단어
</FadeInText>
```

### [비교] — Comparison

```tsx
// Side-by-side bars or A vs B layout
// Use constants.ts SPRING.smooth for bar animations
// fontVariantNumeric: "tabular-nums" for numbers
```

### [카드 나열] — Card List

```tsx
// Staggered card entry with SPRING.heavy
{items.map((item, i) => (
  <FadeInText key={i} delay={i * 6}>{item}</FadeInText>
))}
```

### [숫자 임팩트] — Number Impact

```tsx
const progress = spring({ frame, fps, config: SPRING.heavy });
const num = Math.floor(progress * targetNumber).toLocaleString();
// Style: fontSize 80+, fontWeight 800, fontVariantNumeric: "tabular-nums"
```

### [대화 UI] — Dialogue Bubbles

```tsx
// Speech bubbles with spring entrance
// Full sentence text (not keyword-only)
// Stagger delay between messages
```

---

## Style Guide Quick Reference

### Typography (1080x1920 vertical)

| Element | Min Size | Use |
|---------|----------|-----|
| Scene headline | 72px | Top of scene, accent color |
| Main keyword | 80-120px | Center emphasis |
| Body text | 52px+ | Descriptions (ABSOLUTE MINIMUM) |
| Sub text | 44px | Secondary info |

### Font

- `Pretendard, sans-serif` — all text
- `fontVariantNumeric: "tabular-nums"` — for counters

### Safe Margins

```
Top:    150px (SAFE.top)
Bottom: 170px (SAFE.bottom)
Sides:  60px  (SAFE.side)
```

### Spring Quick Reference

```typescript
import { SPRING } from './constants';

SPRING.heavy   // { damping: 200 }              — smooth, no bounce
SPRING.smooth  // { damping: 12 }               — subtle bounce
SPRING.bouncy  // { damping: 8 }                — playful
SPRING.letter  // { damping: 12, stiffness: 200, mass: 0.8 } — character anim
SPRING.snappy  // { damping: 20, stiffness: 200 }           — quick UI
SPRING.dramatic // { damping: 30, stiffness: 80 }           — heavy impact
```

---

## Building New Components

1. **Build in the video file first** — don't extract prematurely
2. **If reused in 2+ videos** → extract to `src/components/`
3. **Make it frame-driven** — use `useCurrentFrame()` internally
4. **Import constants** — colors, springs, timing from `constants.ts`
5. **Keep props simple** — obvious names, sensible defaults

```tsx
// Template for a new shared component
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SPRING } from '../constants';

type Props = {
  children: React.ReactNode;
  delay?: number;
  color?: string;
};

export const MyComponent: React.FC<Props> = ({
  children,
  delay = 0,
  color = '#f0f0f0',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SPRING.heavy,
  });

  return (
    <div style={{
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
      color,
    }}>
      {children}
    </div>
  );
};
```

---

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| Build from scratch when component exists | Check this registry first |
| Hardcode colors inline | Import palette from constants.ts |
| Put effects on everything | Reserve effects for emphasis |
| Use more than 1-2 accent colors per scene | Stick to palette |
| Leave large empty areas | Scale up elements |
| Use text smaller than 52px | Follow minimums |
| CSS animations | Frame-driven with useCurrentFrame() |

---

## Scene Checklist

Before shipping any scene:

- [ ] All text meets minimum size (52px+)
- [ ] Colors from constants.ts palette only
- [ ] SAFE margins respected on all edges
- [ ] One clear focal point at a time
- [ ] Animations use spring()/interpolate(), not CSS
- [ ] Components from registry used where available
- [ ] Spring configs from SPRING presets, not magic numbers
