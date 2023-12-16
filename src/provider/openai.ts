import OpenAI from "openai";

interface Options {
  text: string;
  apiModel: string;
  apiKey: string;
}
export async function translate(options: Options) {
  const { text, apiKey, apiModel } = options;

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "你是一个翻译引擎，请翻译给出的文本，将给到的文本翻译成英文,只需要翻译不需要解释。",
        },
        { role: "user", content: `${text}` },
      ],
      model: apiModel || "gpt-3.5-turbo",
    });
    return completion.choices?.[0]?.message?.content;
  } catch (error) {
    console.log(error, "openai error");
  }
}
