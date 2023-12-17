import OpenAI from "openai";
import { KEY_BASIC_SETTINGS, KEY_PLATFORM_SETTINGS } from "../constants";
import { getLanguageLabel } from "../utils";

interface Options {
  query: string;
}
export async function translate(options: Options) {
  const { query } = options;

  const results = await chrome.storage.local.get([
    KEY_PLATFORM_SETTINGS,
    KEY_BASIC_SETTINGS,
  ]);

  const { platformSettings, basicSettings } = results || {};
  const apiKey = platformSettings.openai.apiKey;
  const apiModel = platformSettings.openai.apiModel;
  if (!apiKey || !apiModel) return;

  const targetLanguage = getLanguageLabel(basicSettings.targetLanguage);
  console.log(targetLanguage, "targetLanguage");

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `你是一个翻译引擎，请翻译给出的文本，将给到的文本翻译成${targetLanguage},只需要翻译不需要解释。`,
        },
        { role: "user", content: `${query}` },
      ],
      model: apiModel || "gpt-3.5-turbo",
    });
    return {
      result: completion.choices?.[0]?.message?.content || "",
      error: "",
    };
  } catch (error) {
    console.log(error, "openai error");
    return {
      result: "",
      error: error,
    };
  }
}
