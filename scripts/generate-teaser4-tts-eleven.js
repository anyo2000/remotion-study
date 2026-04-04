require("dotenv").config();
const { ElevenLabsClient } = require("elevenlabs");
const fs = require("fs");
const path = require("path");

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const segments = [
  {
    id: "teaser4-s1-eleven",
    text: "예전엔 이런 방법이 통했어요. 자주 찾아뵙고, 밥 한 번 같이 하고, 관계를 쌓다 보면, 보험은 자연스럽게 따라왔거든요.",
  },
  {
    id: "teaser4-s2-eleven",
    text: "그런데요, 지금은 2026년이에요.",
  },
  {
    id: "teaser4-s3-eleven",
    text: "처음 보는 고객에게 전화하고, 메시지로만 소통하고, 만나는 것 자체를 부담스러워하는 분들이 점점 늘고 있어요. 관계부터 쌓겠다는 방식이, 통하지 않는 경우가 많아지고 있는 거죠.",
  },
  {
    id: "teaser4-s4-eleven",
    text: "3초 만에 궁금하게 만들고, 숫자로 필요를 깨닫게 하고, 고객이 직접 하신 말로 확신을 만들어드리는 방법이 있어요. 연결, 진단, 설계, 해결.",
  },
  {
    id: "teaser4-s5-eleven",
    text: "링크 컨설팅. 4월, 전국 런칭.",
  },
];

async function generate() {
  const outDir = path.join(__dirname, "..", "public", "audio");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const seg of segments) {
    console.log(`생성 중: ${seg.id}...`);
    const audioStream = await client.textToSpeech.convert(
      "jsCqWAovK2LkecY7zXl4", // "Freya" — 밝고 활기찬 여성 음성
      {
        text: seg.text,
        model_id: "eleven_multilingual_v2",
        output_format: "mp3_44100_128",
        voice_settings: {
          stability: 0.35,         // 낮을수록 감정/표현력 풍부
          similarity_boost: 0.7,
          style: 0.45,             // 스타일 강도 — 기대감, 활기
          speed: 1.0,
        },
      }
    );

    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    const filePath = path.join(outDir, `${seg.id}.mp3`);
    fs.writeFileSync(filePath, buffer);
    console.log(`완료: ${filePath} (${(buffer.length / 1024).toFixed(0)}KB)`);
  }

  console.log("\n모든 ElevenLabs 음성 생성 완료!");
}

generate().catch(console.error);
