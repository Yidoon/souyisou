import { KEY_BASIC_SETTINGS, KEY_PLATFORM_SETTINGS } from "../constants";

interface TranslateResult {
  confidence?: number;
  rc?: number;
  target?: string[];
}
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
  const token = platformSettings.caiyun.token;

  const targetLanguage = basicSettings.targetLanguage;
  const transType = `auto2${targetLanguage}`;

  const body = {
    source: [query],
    trans_type: transType,
    request_id: "demo",
    detect: true,
  };
  try {
    const res = await fetch(
      "https://api.interpreter.caiyunai.com/v1/translator",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "content-type": "application/json",
          "x-authorization": `token ${token}`,
        },
        body: JSON.stringify(body),
      }
    );
    const resJson = (await res.json()) as TranslateResult;
    return {
      result: resJson?.target?.[0] || "",
      error: "",
    };
  } catch (error) {
    return {
      result: "",
      error: error,
    };
  }
}
