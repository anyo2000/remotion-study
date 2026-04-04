---
name: remotion-best-practices
description: Core Remotion patterns for video production — frame-based animation, spring physics, composition structure, sequencing, rendering, and anti-patterns.
metadata:
  tags: remotion, video, react, animation, spring, composition, rendering
---

## When to use

Use this skill whenever you are writing or modifying Remotion code. It covers the fundamental patterns that every Remotion project needs — from animation primitives to render settings.

---

## Critical Rules

1. **ALL animations MUST use `useCurrentFrame()`** — CSS transitions, CSS animations, and Tailwind animation classes are FORBIDDEN. They do not render correctly because Remotion renders each frame independently.
2. **Use `spring()` for organic motion**, not `interpolate()` with easing. Springs feel natural. Linear/eased interpolations feel mechanical.
3. **Write timing in seconds, convert to frames** — multiply by `fps` from `useVideoConfig()`. Never hardcode frame numbers without commenting the equivalent seconds.
4. **Always clamp interpolations** — use `extrapolateLeft: 'clamp', extrapolateRight: 'clamp'` to prevent values from going out of range.
5. **1920x1080 at 30fps** is the standard (or 1080x1920 for vertical 9:16). All size guidelines assume this resolution.

---

## Animation Fundamentals

### The Frame Model

Remotion renders videos frame-by-frame. Each frame is an independent React render. There is no concept of "time passing" between frames — every frame must be calculable from just the frame number.

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const MyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return <div style={{ opacity }}>Content</div>;
};
```

### Spring Configurations

| Config | Effect | Use For |
|--------|--------|---------|
| `{ damping: 200 }` | Smooth, no bounce | Subtle reveals, backgrounds, fade-ins |
| `{ damping: 200, mass: 1, stiffness: 100 }` | Gentle, elegant | Standard entrances |
| `{ damping: 20, stiffness: 200, mass: 0.8 }` | Snappy, responsive | UI elements, quick reveals |
| `{ damping: 12, mass: 0.5, stiffness: 200 }` | Bouncy, playful | Attention-grabbing entrances |
| `{ damping: 30, mass: 2, stiffness: 80 }` | Heavy, dramatic | Important moments, weighty objects |
| `{ damping: 8 }` | Very bouncy | Playful, cartoon-like |

### Enter + Exit Animation

```tsx
const entrance = spring({ frame, fps, config: { damping: 200 } });
const exit = spring({
  frame, fps,
  delay: durationInFrames - 1 * fps,
  durationInFrames: 1 * fps,
});
const opacity = entrance - exit;
```

---

## Common Patterns

### Staggered List Entrance

```tsx
const STAGGER_DELAY = 4;
{items.map((item, index) => {
  const progress = spring({
    frame: frame - index * STAGGER_DELAY,
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  return (
    <div style={{
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
    }}>{item}</div>
  );
})}
```

### Counter Animation

```tsx
const progress = spring({ frame, fps, config: { damping: 200 } });
const displayNumber = Math.floor(progress * countTo).toLocaleString();
```

### Pulsing/Breathing Effect

```tsx
const pulse = Math.sin(frame * 0.08) * 0.15 + 0.85;
```

---

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| CSS transitions/animations | `spring()` or `interpolate()` with `useCurrentFrame()` |
| `requestAnimationFrame` | `useCurrentFrame()` |
| `setTimeout`/`setInterval` | Frame math (`frame - delay`) |
| `useState` for animation state | Derive everything from `frame` |
| Unclamped interpolation | Always set `extrapolateLeft/Right: 'clamp'` |
| Hardcoded colors/springs in each file | Import from `constants.ts` |

---

## Rendering

```bash
# ProRes for editing
npx remotion render src/index.ts CompositionName out/video.mov \
  --codec prores --prores-profile 4444 --concurrency 16

# H.264 max quality
npx remotion render src/index.ts CompositionName out/video.mp4 \
  --codec h264 --crf 10 --concurrency 16

# Quick preview
npx remotion render src/index.ts CompositionName out/preview.mp4 \
  --codec h264 --crf 23 --scale 0.5 --concurrency 16
```

---

## Detailed API Reference (rules/)

For specific Remotion features, load the corresponding rule file:

- [rules/animations.md](rules/animations.md) — Fundamental animation patterns
- [rules/timing.md](rules/timing.md) — Interpolation curves, spring, easing
- [rules/sequencing.md](rules/sequencing.md) — Series, Sequence, delay, trim
- [rules/transitions.md](rules/transitions.md) — Scene transition patterns
- [rules/text-animations.md](rules/text-animations.md) — Typography and text animation
- [rules/compositions.md](rules/compositions.md) — Composition definitions, stills, folders
- [rules/audio.md](rules/audio.md) — Audio import, trim, volume, speed
- [rules/videos.md](rules/videos.md) — Video embedding, trim, loop
- [rules/assets.md](rules/assets.md) — Images, videos, audio, fonts import
- [rules/fonts.md](rules/fonts.md) — Google Fonts and local fonts
- [rules/charts.md](rules/charts.md) — Chart and data visualization
- [rules/3d.md](rules/3d.md) — 3D with Three.js / React Three Fiber
- [rules/tailwind.md](rules/tailwind.md) — TailwindCSS in Remotion
- [rules/subtitles.md](rules/subtitles.md) — Captions and subtitles
- [rules/light-leaks.md](rules/light-leaks.md) — Light leak overlay effects
- [rules/voiceover.md](rules/voiceover.md) — AI-generated voiceover (TTS)
- [rules/ffmpeg.md](rules/ffmpeg.md) — FFmpeg operations
- [rules/calculate-metadata.md](rules/calculate-metadata.md) — Dynamic metadata
- [rules/parameters.md](rules/parameters.md) — Parametrizable video with Zod
- [rules/maps.md](rules/maps.md) — Mapbox integration
