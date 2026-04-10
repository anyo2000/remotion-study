#!/usr/bin/env node

/**
 * fontSize 최소 기준 검증 스크립트
 *
 * 모든 .tsx/.ts 파일에서 fontSize 값을 추출하고
 * 52px 미만이 있으면 에러를 뱉는다.
 *
 * 사용: node scripts/check-fontsize.js
 * 렌더링 전에 자동으로 돌릴 것.
 */

const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "..", "src");
const MIN_FONT_SIZE = 52;

function getAllFiles(dir, ext) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, ext));
    } else if (ext.some((e) => entry.name.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const violations = [];

  lines.forEach((line, idx) => {
    // fontSize: 숫자 (인라인 스타일)
    const inlineMatches = line.matchAll(/fontSize\s*:\s*(\d+)/g);
    for (const m of inlineMatches) {
      const size = parseInt(m[1], 10);
      if (size < MIN_FONT_SIZE) {
        violations.push({ line: idx + 1, size, text: line.trim() });
      }
    }

    // fontSize={숫자} (JSX prop)
    const propMatches = line.matchAll(/fontSize\s*=\s*\{?\s*(\d+)\s*\}?/g);
    for (const m of propMatches) {
      const size = parseInt(m[1], 10);
      if (size < MIN_FONT_SIZE) {
        // 인라인에서 이미 잡힌 것과 중복 방지
        const alreadyCaught = violations.some(
          (v) => v.line === idx + 1 && v.size === size
        );
        if (!alreadyCaught) {
          violations.push({ line: idx + 1, size, text: line.trim() });
        }
      }
    }

    // 삼항 연산자 내부: ? 숫자 : 숫자 패턴에서 fontSize 관련
    const ternaryMatches = line.matchAll(
      /fontSize\s*:\s*[^,}]*\?\s*(\d+)\s*:\s*(\d+)/g
    );
    for (const m of ternaryMatches) {
      for (const val of [m[1], m[2]]) {
        const size = parseInt(val, 10);
        if (size < MIN_FONT_SIZE) {
          const alreadyCaught = violations.some(
            (v) => v.line === idx + 1 && v.size === size
          );
          if (!alreadyCaught) {
            violations.push({ line: idx + 1, size, text: line.trim() });
          }
        }
      }
    }
  });

  return violations;
}

// 실행
const files = getAllFiles(SRC_DIR, [".tsx", ".ts"]);
let totalViolations = 0;

for (const file of files) {
  const violations = checkFile(file);
  if (violations.length > 0) {
    const rel = path.relative(path.join(__dirname, ".."), file);
    console.error(`\n❌ ${rel}`);
    for (const v of violations) {
      console.error(`   L${v.line}: fontSize ${v.size}px (최소 ${MIN_FONT_SIZE}px)`);
      console.error(`   → ${v.text}`);
    }
    totalViolations += violations.length;
  }
}

if (totalViolations > 0) {
  console.error(
    `\n🚫 총 ${totalViolations}건 위반. 52px 미만 폰트를 수정하세요.\n`
  );
  process.exit(1);
} else {
  console.log("✅ 폰트 크기 검증 통과 — 52px 미만 없음");
  process.exit(0);
}
