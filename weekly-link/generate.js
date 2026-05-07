import "dotenv/config";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const prompt = `
You are a graphic designer creating a printable A4 landscape worksheet for adult insurance sales professionals in South Korea.

## Layout
- A4 landscape orientation (wider than tall)
- Divided into LEFT and RIGHT halves by a subtle vertical dotted fold line in the center
- Overall tone: warm café-journal style, refined and elegant, NOT corporate or childish
- Color palette: warm beige/cream background, dark brown or charcoal text, one muted accent color (dusty blue or sage green) for headers and dividers
- Typography: clean sans-serif for headings, slightly softer serif or rounded sans for body. Large titles, clear hierarchy
- Minimal decoration — no stickers, no cartoon icons. Subtle texture like linen or kraft paper is OK
- Generous but not excessive margins. Print-friendly
- ALL text must be in Korean (한글) as specified below. Render every Korean character clearly and legibly

## LEFT HALF — Magazine Cover Style
Design this like a stylish lifestyle magazine cover page:

Title area at top:
WEEKLY LINK
위클리 링크
Vol.01

Main headline (large, bold, centered):
"판이 바뀌었다"

Subheadline (smaller, under the main headline):
익숙한 방식이 통하지 않는 이유를 돌아보는 주

Four topic boxes or sections, each with a topic number and two lines:

TOPIC 01
만남 · 선물 · 의리 · 보장분석 — 4가지가 동시에 무력화된 이유

TOPIC 02
첫 통화 = 마지막 통화 — SFP 시대, 친해질 기회는 없다

TOPIC 03
AI가 1초에 하는 일을 사람이 해야 하는 이유

TOPIC 04
후킹 — 답 대신 질문을 던지는 새로운 문법이 온다

Bottom section:
NEXT WEEK
"그래서 첫 3초에 뭐라고 말할 것인가"
— 후킹 실전 화법이 옵니다

## RIGHT HALF — MY PAGE (writable worksheet)
Design this as a clean journal page where someone writes by hand:

Header:
MY PAGE

Fields with blank lines:
지점 ____________
이름 ____________

Section ①:
나는 어디에 기대왔나?
Four checkbox items vertically:
□ 자주 만나기
□ 선물/택배
□ 의리/인맥
□ 보장분석 제안

Below checkboxes, a prompt with blank lines:
그게 먹혔다고 느낀 이유:
_______________

Divider line

Section ②:
연락은 했는데 안 만나준 고객이 있다면 —
그 고객은 왜 안 만나줬을까?
_______________
_______________

Divider line

Section ③:
ROUND TABLE
"전문성을 먼저 보여주고, 관계는 그 다음에 만든다"

진짜 가능하다고 생각하나요?

내 생각:
_______________
_______________

동료 의견 중 인상적이었던 것:
_______________
_______________

Divider line

Bottom:
💡 오늘 가장 와닿은 한 문장
_______________

## CRITICAL REQUIREMENTS
- Every single Korean character must be rendered correctly and legibly
- The left side should feel like a magazine you'd pick up at a café
- The right side should feel like a personal journal page with clear writing spaces
- Blank lines for handwriting should be clearly visible thin lines
- The fold line in the center should be a subtle vertical dotted line
- This must look like a real, professional print product
`.trim();

const USE_GPT_IMAGE = process.argv.includes("--gpt-image");

async function generate() {
  const model = USE_GPT_IMAGE ? "gpt-image-2" : "dall-e-3";
  const size = USE_GPT_IMAGE ? "3392x2400" : "1792x1024";
  const quality = "high";

  console.log(`Generating WEEKLY LINK sheet...`);
  console.log(`Model: ${model} | Size: ${size} | Quality: ${quality}`);
  console.log(`(Use --gpt-image flag for gpt-image-2 model)`);
  console.log("");

  const options = {
    model,
    prompt,
    n: 1,
    size,
    quality: USE_GPT_IMAGE ? "high" : "hd",
  };

  if (USE_GPT_IMAGE) {
    options.output_format = "png";
    options.background = "opaque";
  } else {
    options.response_format = "b64_json";
    options.style = "natural";
  }

  const response = await openai.images.generate(options);

  const imageData = response.data[0].b64_json;
  const buffer = Buffer.from(imageData, "base64");

  const outputPath = path.join("output", "weekly-link-a4.png");
  fs.writeFileSync(outputPath, buffer);

  console.log(`Saved: ${outputPath}`);
  console.log(`Size: ${(buffer.length / 1024 / 1024).toFixed(1)} MB`);
}

generate().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
