import { languages } from "./constants";

export function getSearchValue() {
  const searchFormDiv = document.querySelector("#searchform");
  const searchForm = searchFormDiv?.querySelector("form");
  const searchValue = searchForm?.querySelector("textarea")?.value;
  return searchValue;
}

export function setInputValue(value: string) {
  const searchFormDiv = document.querySelector("#searchform");
  const searchForm = searchFormDiv?.querySelector("form");
  // @ts-ignore
  searchForm?.querySelector("textarea")?.value = value;
}

export function mockSearchClick() {
  const searchFormDiv = document.querySelector("#searchform");
  const searchForm = searchFormDiv?.querySelector("form");
  const searchSubmitBtn = searchForm?.querySelector('button[type="submit"]');
  // @ts-ignore
  searchSubmitBtn?.click();
}

export function getLanguageLabel(value: string) {
  const language = languages.find((item) => item.value === value);
  return language?.label;
}

export function controlSouyisouAppVisible(enabled: boolean) {
  const souyisouBtn = document.getElementById("souyisou-app");
  if (!souyisouBtn) return;
  if (enabled) {
    souyisouBtn.classList.remove("souyisou-hide");
    souyisouBtn.classList.add("souyisou-display");
  } else {
    souyisouBtn.classList.remove("souyisou-display");
    souyisouBtn.classList.add("souyisou-hide");
  }
}
