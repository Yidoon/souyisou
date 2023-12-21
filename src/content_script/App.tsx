import { useEffect, useRef, useState } from "react";
import { KEY_BASIC_SETTINGS, KEY_PLATFORM_SETTINGS } from "../constants";
import { BasicSettings, PlatformSettings, TranslateResult } from "../types";
import { translate as openAITranslate } from "../provider/openai";
import { translate as caiyunTranslate } from "../provider/caiyun";
import {
  controlSouyisouAppVisible,
  getSearchValue,
  mockSearchClick,
  setInputValue,
} from "../utils";
import "./app.css";
import { EVENT_CHANGE_HOTKEY, EVENT_TOGGLE_ENABLE_SWITCH } from "../eventsType";
import hotkeys from "hotkeys-js";
import LogoSvg from "../components/LogoSvg";

export default function App() {
  const hotkeyRef = useRef("");
  const loadingRef = useRef(false);

  const init = async () => {
    const results = await chrome.storage.local.get([
      KEY_PLATFORM_SETTINGS,
      KEY_BASIC_SETTINGS,
    ]);

    const { basicSettings } = results || {};
    hotkeyRef.current = basicSettings.hotkey;
    bindHotKey(basicSettings.hotkey);
    controlSouyisouAppVisible(basicSettings.enable === false ? false : true);
  };

  const handleClick = async () => {
    if (loadingRef.current) {
      return;
    }
    const { basicSettings } = await chrome.storage.local.get([
      KEY_BASIC_SETTINGS,
    ]);
    const platform = basicSettings.platform;
    const souyisouIcon = document.querySelector("#souyisou-icon");
    const searchValue = getSearchValue();
    if (!searchValue) {
      return;
    }
    souyisouIcon?.classList.add("rotate");
    let res = {} as TranslateResult;

    loadingRef.current = true;
    if (platform === "openai") {
      res = (await openAITranslate({
        query: searchValue,
      })) as TranslateResult;
    }
    if (platform === "caiyun") {
      res = (await caiyunTranslate({
        query: searchValue,
      })) as TranslateResult;
    }
    if (res?.result) {
      setInputValue(res.result as string);
      mockSearchClick();
    }
    souyisouIcon?.classList.remove("rotate");
    loadingRef.current = false;
  };
  const bindHotKey = (hotkey: string) => {
    hotkeys(hotkey, () => {
      handleClick();
    });
  };
  const bindEvent = async () => {
    chrome.runtime.onMessage.addListener((requeset) => {
      if (requeset.type === EVENT_TOGGLE_ENABLE_SWITCH) {
        controlSouyisouAppVisible(requeset.data);
      }
      if (requeset.type === EVENT_CHANGE_HOTKEY) {
        hotkeys.unbind(hotkeyRef.current);
        bindHotKey(requeset.data);
        hotkeyRef.current = requeset.data;
      }
    });
  };

  useEffect(() => {
    init();
    bindEvent();
  }, []);

  return (
    <div
      onClick={handleClick}
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        paddingRight: "16px",
      }}
    >
      <LogoSvg />
    </div>
  );
}
