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
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="souyisou-icon"
      >
        <g clipPath="url(#clip0_103_10)">
          <path
            d="M15.5 14H14.71L14.43 13.73C15.4439 12.554 16.0011 11.0527 16 9.5C16 8.21442 15.6188 6.95772 14.9046 5.8888C14.1903 4.81988 13.1752 3.98676 11.9874 3.49479C10.7997 3.00282 9.49279 2.87409 8.23192 3.1249C6.97104 3.3757 5.81285 3.99477 4.90381 4.90381C3.99477 5.81285 3.3757 6.97104 3.1249 8.23192C2.87409 9.49279 3.00282 10.7997 3.49479 11.9874C3.98676 13.1752 4.81988 14.1903 5.8888 14.9046C6.95772 15.6188 8.21442 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
            fill="#4285F4"
          />
          <path
            d="M19.2769 11.2384L18.4896 11.1728L18.233 10.8805C19.341 9.79273 20.0209 8.34284 20.1487 6.79542C20.2554 5.51427 19.9798 4.23026 19.3568 3.10574C18.7338 1.98122 17.7913 1.0667 16.6485 0.477831C15.5057 -0.111037 14.214 -0.347807 12.9366 -0.202538C11.6593 -0.0572684 10.4537 0.463515 9.47235 1.29396C8.49099 2.1244 7.77791 3.2272 7.4233 4.4629C7.0687 5.69861 7.08848 7.01172 7.48016 8.23618C7.87183 9.46064 8.61781 10.5415 9.62375 11.342C10.6297 12.1425 11.8504 12.6267 13.1316 12.7334C14.736 12.867 16.2599 12.4019 17.4773 11.52L17.7231 11.8214L17.6575 12.6087L22.226 17.9965L23.8346 16.6354L19.2769 11.2384ZM13.2976 10.7403C10.8162 10.5336 8.97997 8.36368 9.18667 5.88227C9.39337 3.40087 11.5633 1.56466 14.0447 1.77136C16.5261 1.97807 18.3623 4.14798 18.1556 6.62939C17.9489 9.1108 15.779 10.947 13.2976 10.7403Z"
            fill="#F4C242"
          />
        </g>
      </svg>
    </div>
  );
}
