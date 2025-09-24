(function () {
  // Ensure overlay exists (prevents errors even if you forget the div)
  function ensureOverlay() {
    let el = document.getElementById("page-transition");
    if (!el) {
      el = document.createElement("div");
      el.id = "page-transition";
      // Insert early to avoid any flash if possible
      (document.body || document.documentElement).appendChild(el);
    }
    return el;
  }

  const overlay = ensureOverlay();

  // FIRST LOAD: fade OUT (reveal page) after a tiny delay so images settle
  window.addEventListener("load", () => {
    setTimeout(() => {
      overlay.classList.remove("fade-in");
      overlay.classList.add("fade-out");
    }, 200); // adjust if you still see image popping
  });

  // LEAVE: intercept normal left-click navigations only
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a");
    if (!a) return;

    // Respect default behaviors / new tab / modified clicks / special links
    if (e.defaultPrevented) return;
    if (e.button === 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;

    const href = a.getAttribute("href");
    if (!href) return;
    const lower = href.toLowerCase();
    if (lower.startsWith("#") || lower.startsWith("mailto:") || lower.startsWith("tel:")) return;

    // Cover, then navigate after the slow fade-in
    e.preventDefault();
    overlay.classList.remove("fade-out");
    overlay.classList.add("fade-in");

    // Keep this in sync with CSS .fade-in duration (3000ms here)
    setTimeout(() => {
      window.location.href = href;
    }, 3000);
  }, true);

  // Handle bfcache restores (so overlay isn't stuck)
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      overlay.classList.remove("fade-in");
      overlay.classList.add("fade-out");
    }
  });
})();
