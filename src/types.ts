export interface PlatformSettings {
  openai?: OpenAIFormData;
  caiyun?: CaiyunFormData;
  [key: string]: any;
}
export interface BasicSettings {
  targetLanguage?: string;
  hotkey?: string;
  platform?: string;
  enable?: boolean;
}

export interface OpenAIFormData {
  apiKey?: string;
  apiModel?: string;
}
export interface CaiyunFormData {
  token?: string;
}

export interface CaiyunFormData {
  token?: string;
}

export interface TranslateResult {
  result: string;
  error: string;
}
