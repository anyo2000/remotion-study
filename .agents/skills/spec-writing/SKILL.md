---
name: spec-writing
description: How to write production-quality video specs — the structured documents that turn scripts into buildable scene-by-scene blueprints for Remotion animations.
metadata:
  tags: spec, specification, brief, script, planning, workflow, video-production
---

## When to use

Use this skill when writing or reviewing a video spec (the markdown document that describes what a Remotion video should look like, scene by scene). This covers spec structure, timing notation, visual direction language, and templates.

---

## What Is a Spec

A spec is a markdown document that describes a video precisely enough for someone (or an AI) to build it. It sits between the raw script (what you want to say) and the code (what gets rendered).

**Without a spec:** "Make it look cool" → ambiguous, requires constant back-and-forth.
**With a spec:** Scene-by-scene blueprint → buildable on first pass, iterate from there.

---

## Spec Structure

### 1. Overview

```markdown
# Project Name

## Overview
- **Duration:** ~X minutes (YYYY frames at 30fps)
- **Style:** [Dark/cinematic, bright/playful, technical/system, warm/historical]
- **Resolution:** 1080x1920 @ 30fps (vertical 9:16)
- **Target:** YouTube Shorts / Social / Presentation
- **Color palette:** [Palette name from constants.ts]
```

### 2. Scene Breakdown

```markdown
### Scene N: [Descriptive Name] (Xs-Ys)
**Duration:** Z seconds (frames XXX-YYY)

**Narration:**
> "Exact voiceover text for this scene. Word for word."

**Visuals:**
- Frame 0-30: Title fades in from bottom, large centered text
- Frame 30-45: Subtitle appears below with gentle spring
- Frame 45-120: [Main visual description]
- Frame 120-150: Everything fades out

**Components:**
- SceneHeadline for title
- FadeInText for content
- GradientBackground with blue palette

**Notes:**
- Emphasize "key term" with accent color
- Keep this scene sparse — one focal point
```

### 3. Color Flow (optional but valuable)

```markdown
## Color Flow
| Section | Frames | Dominant Color | Mood |
|---------|--------|---------------|------|
| Intro | 0-200 | Blue accent | Professional, trust |
| Problem | 200-600 | Muted sub | Tension, concern |
| Solution | 600-900 | Accent bright | Relief, clarity |
```

---

## Timing Notation

Always provide both seconds and frames:

```markdown
Frame 0-15 (0s-0.5s): Title entrance
Frame 15-90 (0.5s-3s): Content hold
Frame 90-105 (3s-3.5s): Fade out
```

### Conversion at 30fps

| Seconds | Frames |
|---------|--------|
| 0.5s | 15 |
| 0.7s | 21 (standard GAP) |
| 1s | 30 |
| 2s | 60 |
| 3s | 90 |
| 5s | 150 |

---

## Visual Direction Language

### Entrances

| Term | Meaning |
|------|---------|
| **Fade in** | Opacity 0→1 |
| **Slide up** | Translate from below + fade |
| **Pop in** | Scale from 0.5→1 with bouncy spring |
| **Type in** | Character-by-character typewriter |
| **Count up** | Number animates from 0 to target |
| **Build piece by piece** | Elements appear one at a time with stagger |

### Emphasis

| Term | Meaning |
|------|---------|
| **Highlight** | Apply accent color + bold weight |
| **Glow** | Add text-shadow or box-shadow pulse |
| **Pulse** | Breathing scale/opacity animation |

### Pacing

| Term | Meaning |
|------|---------|
| **Let it land** | Hold for 3-5 seconds after key moment |
| **Build tension** | Slow entrance, pause before reveal |
| **Rapid fire** | Fast staggered list |
| **Breathe** | Slow spring, generous spacing |

---

## Three Specification Levels

### Loose (AI makes interpretive choices)

```markdown
### Scene 3: The Scale Problem (15s-25s)
Show how the numbers get absurdly large. Make it feel overwhelming.
```

### Medium (guided direction) — most scenes

```markdown
### Scene 3: The Scale Problem (15s-25s)
**Duration:** 10 seconds (300 frames)
**Narration:** > "매달 2억 명이 사용합니다."
**Visuals:**
- Big CountUp animation to 200,000,000
- Sparse — just the number, centered
- Hold for 2 seconds after landing
```

### Tight (frame-by-frame for hero moments)

```markdown
### Scene 3: The Scale Problem (15s-25s)
**Duration:** 10 seconds (frames 450-750)
**Visuals:**
- Frame 0-15: Empty dark background, subtle gradient
- Frame 15-75: CountUp 0→200,000,000, font 108px, weight 700
  - Spring { damping: 200 }, comma separators
- Frame 75-90: Number pulses (scale 1→1.02→1), subtle glow
- Frame 90-210: Hold. No movement.
- Frame 210-240: Fade to black
- Frame 240-300: Subtext "매달." fade in, 48px, muted color
```

---

## Spec Review Checklist

Before building begins, verify:

- [ ] Every scene has narration text
- [ ] Every scene has duration in seconds AND frames
- [ ] Visual descriptions use concrete terms (not "make it cool")
- [ ] Key emphasis moments are explicitly called out
- [ ] Color palette is defined (from constants.ts)
- [ ] Transitions specified (fade 15 frames standard)
- [ ] Text sizes follow minimums (72px title, 52px body)
- [ ] At least one hero moment gets tight spec treatment
- [ ] Pacing varies — not every scene same speed
- [ ] Scene tags from CLAUDE.md applied ([키워드 강조], [비교], [흐름도], etc.)

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No narration text | Always include voiceover text |
| "Make it look good" | Use specific visual direction terms |
| Every scene same length | Vary: 5s for impact, 15s for explanation |
| No emphasis marked | Bold/highlight 1-3 key terms per scene |
| Frame numbers without seconds | Always provide both |
| No color direction | Reference palette from constants.ts |

---

## Blank Spec Template

```markdown
# [Project Name]

## Overview
- **Duration:** ~X minutes (YYYY frames at 30fps)
- **Style:** [Description]
- **Resolution:** 1080x1920 @ 30fps
- **Palette:** [blue / orange / pink from constants.ts]

## Scene Breakdown

### Scene 1: [Name] (0:00-0:XX)
**Duration:** Xs (frames 0-XX)
**Tag:** [키워드 강조 / 비교 / 흐름도 / 카드 나열 / 숫자 임팩트 / 대화 UI / 반전]
**Tone:** [정돈 / 가벼운]

**Narration:**
> "..."

**Visuals:**
- Frame 0-15: [Description]
- Frame 15-XX: [Description]

**Components:** [What to use from src/components/]
**Notes:** [Emphasis, mood, pacing]

---

### Scene 2: [Name] (0:XX-0:YY)
...

## Global Notes
- Palette: [name] from constants.ts
- Transitions: fade 15 frames (FADE_FRAMES)
- Inter-scene gap: 21 frames (GAP_FRAMES)
- Last scene tail: 75 frames (SCENE_TAIL)
```
