import { useEffect, useState } from "react";
import { Root, createRoot } from "react-dom/client";
import Popup from "./App";
import { PopupContextProvider, useStore } from "./store";
import { KEY_BASIC_SETTINGS, KEY_PLATFORM_SETTINGS } from "../constants";

function App() {
  const [isInitDone, setIsInitDone] = useState(false);

  const store = useStore();
  const initData = async () => {
    const data = await chrome.storage.local.get([
      KEY_PLATFORM_SETTINGS,
      KEY_BASIC_SETTINGS,
    ]);
    console.log(data, "local all data");
    if (data[KEY_PLATFORM_SETTINGS]) {
      store.setPlatformSettings(data[KEY_PLATFORM_SETTINGS]);
    }
    if (data[KEY_BASIC_SETTINGS]) {
      store.setBasicSettings(data[KEY_BASIC_SETTINGS]);
    }
    setIsInitDone(true);
  };

  useEffect(() => {
    console.log("init Data");
    initData();
  }, []);

  return (
    <PopupContextProvider value={store}>
      {isInitDone ? <Popup /> : null}
    </PopupContextProvider>
  );
}

window.onload = () => {
  const popupEl = document.getElementById("popup-app");
  let root: Root | null = null;

  if (popupEl) {
    if (!root) {
      root = createRoot(popupEl);
    }
    root.render(<App />);
  }
};
