import logo from "../public/logo.svg?raw";

const APP_URL: string | undefined = import.meta.env.WXT_APP_URL;
const DARK_COLOR = "oklch(0.7058 0.0777 302.0489)";
const LIGHT_COLOR = "oklch(0.6104 0.0767 299.7335)";

function getGitHubTheme(): "light" | "dark" {
  const colorMode = document.documentElement.getAttribute("data-color-mode");
  if (colorMode === "dark") return "dark";
  if (colorMode === "light") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function injectButton() {
  if (!APP_URL || APP_URL === "") return;

  const actionList =
    document.querySelector<HTMLUListElement>(".pagehead-actions");
  if (!actionList) return;

  if (document.querySelector<HTMLAnchorElement>("#active-forks-btn")) return;

  const [owner, repo] = window.location.pathname.split("/").filter(Boolean);
  if (!owner || !repo || owner === "" || repo === "") return;

  const dynamicUrl = `${APP_URL}/${owner}/${repo}`;

  const theme = getGitHubTheme();
  const iconColor = theme === "dark" ? DARK_COLOR : LIGHT_COLOR;

  const listItem = document.createElement("li");
  listItem.style.marginRight = "8px";

  const button = document.createElement("a");
  button.id = "active-forks-btn";

  button.className = "btn btn-sm tooltipped tooltipped-s";
  button.setAttribute("aria-label", "Open in Active Forks");
  button.href = dynamicUrl;
  button.target = "_blank";
  button.style.display = "inline-flex";
  button.style.alignItems = "center";

  const wrapper = document.createElement("span");
  wrapper.style.color = iconColor;
  wrapper.style.display = "inline-flex";
  wrapper.style.alignItems = "center";
  wrapper.innerHTML = logo;

  const label = document.createElement("span");
  label.textContent = "Active Forks";
  label.style.marginLeft = "4px";

  button.appendChild(wrapper);
  button.appendChild(label);

  listItem.appendChild(button);
  actionList.insertBefore(listItem, actionList.firstChild);
}

export default defineContentScript({
  matches: ["*://github.com/*"],
  main() {
    injectButton();

    document.addEventListener("turbo:load", injectButton);

    const observer = new MutationObserver(() => {
      if (
        document.querySelector(".pagehead-actions") &&
        !document.querySelector("#active-forks-btn")
      ) {
        injectButton();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
});
