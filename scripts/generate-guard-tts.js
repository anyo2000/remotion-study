require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const segments = [
  {
    id: "guard-01-connect",
    text: '연결에서 진단까지. 제일 중요한 첫 번째 연결은요, 이 사람의 경계심을 무너뜨리는 겁니다.',
  },
  {
    id: "guard-02-prejudice",
    text: '"오늘 보장 분석 해드리려고요" 이런 말 못 쓰게 할 거고요. "보장 분석 해드리려고 왔는데요"라고 하는 순간 뭐가 되냐, 보장 분석에 연결된 지금까지 만났던 모든 FP들의 선입견이 다 들어옵니다. "쟤 결국엔 나한테 보험 팔라고 하겠구나, 부담 주겠구나" 하니까 안 만나지죠.',
  },
  {
    id: "guard-03-arms",
    text: '만나도 어떻게 해요? 팔짱을 끼고 앉아요. "보험 나 절대 넘어가지 말아야지" 하는 자기의 다짐과, 틈을 보이지 않겠다는 그런 의지들이 보여. 그러면 안 돼요.',
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
