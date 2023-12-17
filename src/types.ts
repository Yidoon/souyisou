export interface BasicSettings {
  targetLanguage?: string;
  hotkey?: string;
  platform?: string;
}

export interface OpenAIFormData {
  apiKey?: string;
  apiModel?: string;
}

export interface CaiyunFormData {
  token?: string;
}

export interface PlatformSettings {
  openai?: OpenAIFormData;
  caiyun?: CaiyunFormData;
  [key: string]: any;
}

export interface TranslateResult {
  result: string;
  error: string
}