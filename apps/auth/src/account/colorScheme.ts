import { getKcContext } from "./KcContext";

const DARK_THEME_CLASS = "dark";

function setIsDarkModeEnabled(isDarkModeEnabled: boolean) {
  const elementId = "root-color-scheme-style";
  document.getElementById(elementId)?.remove();

  const element = document.createElement("style");
  element.id = elementId;
  element.innerHTML = `:root { color-scheme: ${isDarkModeEnabled ? "dark" : "light"}; }`;
  document.head.appendChild(element);

  document.documentElement.style.removeProperty("background-color");

  const { classList } = document.documentElement;
  if (isDarkModeEnabled) {
    classList.add(DARK_THEME_CLASS);
  } else {
    classList.remove(DARK_THEME_CLASS);
  }
}

export function startColorSchemeManagement() {
  const { kcContext } = getKcContext();

  if (kcContext.darkMode === false) {
    setIsDarkModeEnabled(false);
    return;
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  setIsDarkModeEnabled(mediaQuery.matches);
  mediaQuery.addEventListener("change", (event) =>
    setIsDarkModeEnabled(event.matches),
  );
}
