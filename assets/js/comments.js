// giscus comments (GitHub Discussions on this repo). Each post maps to one
// discussion by URL pathname. Sorting (Oldest/Newest) and reactions are
// provided by the giscus widget; the theme follows the site's dark/light toggle.
(function () {
  const mount = document.getElementById("giscus-mount");
  if (!mount) return;

  const giscusTheme = () =>
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark_dimmed" : "light";

  const s = document.createElement("script");
  s.src = "https://giscus.app/client.js";
  Object.entries({
    "data-repo": "sumanyumuku98/sumanyumuku98.github.io",
    "data-repo-id": "R_kgDOGWOT6g",
    "data-category": "Announcements",
    "data-category-id": "DIC_kwDOGWOT6s4DK6IA",
    "data-mapping": "pathname",
    "data-strict": "1",
    "data-reactions-enabled": "1",
    "data-emit-metadata": "0",
    "data-input-position": "top",
    "data-theme": giscusTheme(),
    "data-lang": "en",
    "data-loading": "lazy",
  }).forEach(([k, v]) => s.setAttribute(k, v));
  s.crossOrigin = "anonymous";
  s.async = true;
  mount.appendChild(s);

  new MutationObserver(() => {
    const frame = document.querySelector("iframe.giscus-frame");
    if (frame) frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: giscusTheme() } } }, "https://giscus.app");
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
