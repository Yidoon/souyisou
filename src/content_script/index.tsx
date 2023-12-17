import { createRoot, Root } from "react-dom/client";
import App from "./App";

let root: Root;

window.addEventListener("load", function () {
  const searchFormDiv = document.querySelector("#searchform");
  const searchForm = searchFormDiv?.querySelector("form");
  const searchSubmitBtn = searchForm?.querySelector('button[type="submit"]');
  if (searchSubmitBtn) {
    const el = document.createElement("div");
    el.className = "souyisou-btn";
    el.id = "souyisou-app";
    searchSubmitBtn.parentNode?.appendChild(el);

    if (!root) {
      root = createRoot(el);
    }
    root.render(<App />);
  }
});
