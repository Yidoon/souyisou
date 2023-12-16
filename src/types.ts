export interface BasicSettings {
  targetLanguage?: string;
  hotkey?: string;
  platform?: string;
}

export interface OpenAIFormData {
  apiKey?: string;
  apiModel?: string;
}

export interface PlatformSettings {
  openai?: OpenAIFormData;
  [key: string]: any;
}
