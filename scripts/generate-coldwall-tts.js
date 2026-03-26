require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const segments = [
  {
    id: "cold-01-avoid",
    text: "첫 번째, 사람들이 만나는 거를 꺼려요. 이게 코로나 때 너무 심각해지긴 했는데 그때 이후로 사람들이 안 만납니다. 여의도에 7시 넘으면 대부분의 음식점들 다 닫아요. 술을 안 먹어요. 젊은 사람들은 다 메신저로 대화합니다. 대화를 얼굴 보고 하지 않아요. 이게 너무 습관화됐죠.",
  },
  {
    id: "cold-02-loyalty",
    text: "그리고 의리 가입이 종말입니다. 이제는 친하다고 해서, 관계 때문에, 인맥 때문에 하는 계약들이 점점 없어지고 있습니다. 형제들도 5만 원 비싸다고 가는 사람들이 있더라고요. 의리 가지고 하지 않고 객관적인 내 이득 가지고 하는 정도로 마음들이 좀 가난해졌어요.",
  },
  {
    id: "cold-03-sfp",
    text: "SFP는 DB로 콜 하고 처음 만나는 사람이다 보니까 친숙이라는 게 아예 없어요. 친하지 않은 상태에서 갑니다. 이미 만나기도 전부터 적대적이야. 그런 사람들을 뚫어야 되니까 새로운 컨설팅이 필요한 거죠.",
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
