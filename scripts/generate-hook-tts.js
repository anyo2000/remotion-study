require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const segments = [
  {
    id: "hook-01-cascade",
    text: '임신하면 왜 돈 받아요? 축하금 주죠. 임신 안 하면? 난임 치료 주잖아요. 근데 심지어는 "나는 결혼 계획도 없는데요"라고 말할 수 있잖아요. 그럼 어떡해? 상관없어요.',
  },
  {
    id: "hook-02-method",
    text: '딱 봐도 뭔가 결혼 적령기에 있는 사람한테 했을 때 지나가는 말 중에 하나로 했다가 이 사람이 혹해서 걸려들면 여기서 상담이 되는 거죠. 그런 화법들을 여러 개 갖고 있어야지 대화 중에 던지는 겁니다.',
  },
  {
    id: "hook-03-flow",
    text: '제가 오늘 하는 것들은 흐름을 쭉 한번 시연하는 거예요. 세부적인 화법들은 4월에 다 나올 거고 이 자료들은 다 드릴 거니까, 이 흐름이 진짜 내가 써먹기에 좋은가, 이게 논리가 맞나 이거 위주로 보시면 좋을 것 같습니다.',
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
