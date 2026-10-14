(function () {
  // Runs before first paint (inlined in <head>, hashed into the CSP) so the
  // page never flashes the wrong theme. "root" is the pre-2.0 name for blue.
  var d = document.documentElement, t;
  try { t = localStorage.getItem("theme"); } catch (e) {}
  if (t === "root") t = "blue";
  if (t !== "light" && t !== "dark" && t !== "blue") {
    t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  d.dataset.theme = t;
  d.classList.add("js");
})();
