import React, { useState } from "react";
import { KEY_BASIC_SETTINGS, KEY_PLATFORM_SETTINGS } from "../constants";

export interface PopupContextType {
  targetLanguage?: string;
  hotkey?: string;
  platform?: string;
  openai?: {
    apiKey?: string;
    apiModel?: string;
  };
}

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

export const PopupContext = React.createContext(
  {} as ReturnType<typeof useStore>
);
export const PopupContextProvider = PopupContext.Provider;

type SetStateAction<S> = S | ((prevState: S) => S);

export function useStore() {
  const [basicSettings, _setBasicSettings] = useState<BasicSettings>({});
  const [platformSettings, _setPlatformSettings] = useState<PlatformSettings>(
    {}
  );
  const setPlatformSettings = async (
    stateAction: SetStateAction<PlatformSettings>
  ) => {
    let data;
    if (typeof stateAction === "function") {
      data = stateAction(platformSettings);
    } else {
      data = stateAction;
    }

    _setPlatformSettings(data);

    await chrome.storage.local.set({ [KEY_PLATFORM_SETTINGS]: data });
  };

  const setBasicSettings = async (
    stateAction: SetStateAction<BasicSettings>
  ) => {
    let data;
    if (typeof stateAction === "function") {
      data = stateAction(basicSettings);
    } else {
      data = stateAction;
    }
    _setBasicSettings(data);

    await chrome.storage.local.set({ [KEY_BASIC_SETTINGS]: data });
  };

  return {
    basicSettings,
    platformSettings,
    setBasicSettings,
    setPlatformSettings,
  };
}
