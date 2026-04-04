require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const segments = [
  {
    id: "teaser4-s1",
    text: "예전엔 이게 됐습니다. 자주 만나고, 밥 한 번 사고, 관계를 쌓으면, 보험은 따라왔습니다.",
  },
  {
    id: "teaser4-s2",
    text: "그런데, 2026년입니다.",
  },
  {
    id: "teaser4-s3",
    text: "첫 통화 DB 영업. 메시지로만 소통하는 고객. 만남 자체를 꺼리는 시대. 관계부터 쌓겠다는 건, 이제 통하지 않습니다.",
  },
  {
    id: "teaser4-s4",
    text: "3초 만에 궁금하게 만들고, 숫자로 ���요를 깨닫게 하고, 고객의 말로 확신을 만들어주는 법. 연결, 진단, 설계, 해결.",
  },
  {
    id: "teaser4-s5",
    text: "LINK 컨설팅. 4월, 전국 런칭.",
  },
];

async function generate() {
  const outDir = path.join(__dirname, "..", "public", "audio");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

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
