require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const segments = [
  {
    id: "gift-01-oldway",
    text: "예전에 어떻게 보험 팔았나 하면요, 사람들 만나서 선물을 줍니다. 이렇게 선물이란 것도 대단한 거 아니고 롤팩 주고요, 비닐팩 주고요, 크린백 이런 거 주다 보면 열 번 받으면 사람들이 계약을 했습니다.",
  },
  {
    id: "gift-02-reject",
    text: "요즘에 특히 젊은 사람들은 그러죠. 이런 거 갖고 오지 말라고. 이런 거 왜 주냐고. 옛날엔 공짜면 다 좋아했는데 요즘에는 그렇지 않습니다. 경계심이 세요. 왜 나한테 도움 되지 않는 걸 왜 나한테 주지?",
  },
];

async function generate() {
  const outDir = path.join(__dirname, "..", "public", "audio");

  for (const seg of segments) {
    console.log(`생성 중: ${seg.id}...`);
    const response = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "nova",
      input: seg.text,
      speed: 1.4,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const filePath = path.join(outDir, `${seg.id}.mp3`);
    fs.writeFileSync(filePath, buffer);
    console.log(`완료: ${filePath}`);
  }

  console.log("\n모든 음성 생성 완료!");
}

generate().catch(console.error);
