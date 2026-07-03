#!/usr/bin/env node
/**
 * check-rhythm.js — 비주얼 리듬 규칙 자동 검사 (CLAUDE.md "비주얼 리듬 규칙")
 *
 * beats.ts를 파싱해서 씬별로 검사:
 *   R1. 씬 시작 후 5초(150fr) 이내 첫 비주얼 변화
 *   R2. 어떤 시점에서든 10초(300fr) 이상 비주얼 변화 없음 금지 (비트 간 간격 + 마지막 비트~씬 끝)
 *   R3. 마지막 요소 등장 후 최소 2초(60fr) 유지
 *   R4. 20초(600fr) 초과 씬은 정보로 표시 (비트 밀도가 충분하면 통과)
 *
 * 사용: node scripts/check-rhythm.js src/{에피소드}/{에피소드}-beats.ts
 *       node scripts/check-rhythm.js src/{에피소드}/          (폴더 주면 *-beats.ts 자동 탐색)
 *
 * 전제 포맷 (v4-build 표준):
 *   const S1 = 0.0;                        // 씬 시작 초
 *   export const BEATS_XXX = { KEY: local(단어초, S1), ... };
 *   export const SCENE1_DUR = Math.round((끝초 - S1) * FPS) [+ 여유프레임];
 */

const fs = require("fs");
const path = require("path");

const FPS = 30;
const FIRST_CHANGE_MAX = 5 * FPS;   // R1: 150fr
const STATIC_GAP_MAX = 10 * FPS;    // R2: 300fr
const LAST_HOLD_MIN = 2 * FPS;      // R3: 60fr
const LONG_SCENE = 20 * FPS;        // R4: 600fr

function resolveBeatsFile(arg) {
  const p = path.resolve(arg);
  if (fs.statSync(p).isDirectory()) {
    const found = fs.readdirSync(p).find((f) => f.endsWith("-beats.ts"));
    if (!found) throw new Error(`폴더에 *-beats.ts 없음: ${p}`);
    return path.join(p, found);
  }
  return p;
}

function parse(src) {
  // 씬 시작 변수: const S1 = 0.0;
  const sceneStarts = {};
  for (const m of src.matchAll(/const\s+(S\d+)\s*=\s*([\d.]+)\s*;/g)) {
    sceneStarts[m[1]] = parseFloat(m[2]);
  }

  // 씬 duration: SCENE1_DUR = Math.round((40.0 - S1) * FPS) [+ 75]
  const durs = {};
  for (const m of src.matchAll(
    /SCENE(\d+)_DUR\s*=\s*Math\.round\(\(([\d.]+)\s*-\s*(S\d+)\)\s*\*\s*FPS\)(?:\s*\+\s*(\d+))?/g
  )) {
    const [, num, endSec, sVar, bonus] = m;
    const start = sceneStarts[sVar];
    if (start === undefined) continue;
    durs[sVar] = Math.round((parseFloat(endSec) - start) * FPS) + (bonus ? parseInt(bonus, 10) : 0);
  }

  // BEATS 블록: export const BEATS_XXX = { ... };
  const scenes = [];
  for (const m of src.matchAll(/export\s+const\s+(BEATS_\w+)\s*=\s*\{([\s\S]*?)\}\s*as\s+const/g)) {
    const [, name, body] = m;
    const beats = [];
    let sVar = null;
    for (const b of body.matchAll(/(\w+)\s*:\s*local\(\s*([\d.]+)\s*,\s*(S\d+)\s*\)/g)) {
      const [, key, audioSec, sv] = b;
      sVar = sVar || sv;
      const start = sceneStarts[sv];
      if (start === undefined) continue;
      beats.push({ key, frame: Math.round((parseFloat(audioSec) - start) * FPS) });
    }
    if (beats.length === 0) continue; // local() 미사용 블록은 검사 불가 — 건너뜀
    scenes.push({ name, sVar, beats, dur: sVar ? durs[sVar] : undefined });
  }
  return scenes;
}

function check(scenes) {
  let errors = 0;
  for (const sc of scenes) {
    const frames = sc.beats.map((b) => b.frame).sort((a, b) => a - b);
    const issues = [];

    // R1: 첫 변화 5초 이내
    if (frames[0] > FIRST_CHANGE_MAX) {
      issues.push(`R1 첫 비주얼 변화가 ${(frames[0] / FPS).toFixed(1)}s — 5s 초과`);
    }

    // R2: 비트 간 간격 10초 초과 금지
    for (let i = 1; i < frames.length; i++) {
      const gap = frames[i] - frames[i - 1];
      if (gap > STATIC_GAP_MAX) {
        const a = sc.beats.find((b) => b.frame === frames[i - 1]);
        const b = sc.beats.find((x) => x.frame === frames[i]);
        issues.push(
          `R2 정적 구간 ${(gap / FPS).toFixed(1)}s — ${a.key}(${(frames[i - 1] / FPS).toFixed(1)}s) → ${b.key}(${(frames[i] / FPS).toFixed(1)}s)`
        );
      }
    }

    if (sc.dur !== undefined) {
      const last = frames[frames.length - 1];
      // R2b: 마지막 비트 이후 씬 끝까지
      const tailGap = sc.dur - last;
      if (tailGap > STATIC_GAP_MAX) {
        issues.push(`R2 마지막 비트 후 정적 ${(tailGap / FPS).toFixed(1)}s (씬 끝까지) — 10s 초과`);
      }
      // R3: 마지막 요소 최소 2초 유지
      if (tailGap < LAST_HOLD_MIN) {
        issues.push(`R3 마지막 요소 유지 ${(tailGap / FPS).toFixed(1)}s — 2s 미만 (등장 타이밍 앞당길 것)`);
      }
      // R4: 20초+ 씬 정보 표시
      if (sc.dur > LONG_SCENE && issues.length === 0) {
        console.log(`ℹ️  ${sc.name}: ${(sc.dur / FPS).toFixed(1)}s 장면 — 리듬 검사는 통과 (비트 ${frames.length}개)`);
      }
    }

    if (issues.length > 0) {
      errors += issues.length;
      console.log(`❌ ${sc.name} (${sc.sVar}${sc.dur !== undefined ? `, ${(sc.dur / FPS).toFixed(1)}s` : ""})`);
      for (const i of issues) console.log(`   - ${i}`);
    } else {
      console.log(`✅ ${sc.name} — 비트 ${frames.length}개`);
    }
  }
  return errors;
}

const arg = process.argv[2];
if (!arg) {
  console.error("사용법: node scripts/check-rhythm.js <beats.ts 경로 또는 에피소드 폴더>");
  process.exit(2);
}

const file = resolveBeatsFile(arg);
const scenes = parse(fs.readFileSync(file, "utf8"));
if (scenes.length === 0) {
  console.error(`⚠️  BEATS 블록을 못 찾음 (local() 표준 포맷 아님): ${file}`);
  process.exit(2);
}

console.log(`리듬 검사: ${path.relative(process.cwd(), file)} — 씬 ${scenes.length}개\n`);
const errors = check(scenes);
console.log(errors === 0 ? "\n통과 — 리듬 위반 없음" : `\n위반 ${errors}건 — beats.ts 수정 필요`);
process.exit(errors === 0 ? 0 : 1);
