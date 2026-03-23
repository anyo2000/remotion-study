require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const segments = [
  {
    id: "01-members",
    text: "현재 실손보험 가입자 4천만 명입니다. 1세대, 2세대, 3세대, 4세대. 이 4천만 명의 고객이 궁금해하고 있습니다. 비율 보시면 1세대부터 2세대, 3세대, 4세대 이렇게 나와 있는데요. 고르게 많이 분포되어 있습니다.",
  },
  {
    id: "02-reentry",
    text: "그리고 하나 더 그래프를 준비했는데요. 21년 7월 가입자부터 5년 재가입이 벌써 옵니다. 21년이니까, 26년 7월이면 벌써 이게 도래하게 되는 거죠. 그 고객이 어떻게 돼요? 7월엔 1,900명인데, 우리 회사에서만 10월이 되면 4,600명으로 이렇게 많이 늘어나게 됩니다. 전 보험업계 상대로 보면 어떨까요? 어마어마한 숫자가 이 재가입 시기에 도래하는 거죠.",
  },
  {
    id: "03-question",
    text: '저는 이 사람들이 물어볼 것 같습니다. "내 실손은 어떻게 되는 거야?" 라고. 이제 연락하던, 가까이 지내던 분들한테 물어볼 텐데, 저는 그 대상이 여러분이었으면 좋겠고, 다른 설계사가 아니었으면 좋겠습니다.',
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
