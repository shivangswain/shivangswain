/**
 * Theme type definition
 */
type Theme = "light" | "dark" | "root";

/**
 * Sets up the theme toggle functionality
 */
export function setupThemeToggle() {
  const themeColor = document.querySelector(
    'meta[name="theme-color"]'
  ) as HTMLMetaElement;
  const themeToggle = document.getElementById(
    "theme-toggle"
  ) as HTMLButtonElement;
  const themeIcon = themeToggle.querySelector("i") as HTMLElement;
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Function to get the next theme in the cycle
  const getNextTheme = (currentTheme: Theme): Theme => {
    const themeOrder: Theme[] = ["light", "dark", "root"];
    const currentIndex = themeOrder.indexOf(currentTheme);
    return themeOrder[(currentIndex + 1) % themeOrder.length];
  };

  // Function to update theme classes and icon
  const updateTheme = (theme: Theme): void => {
    // Remove all theme classes first
    document.body.classList.remove("dark-mode", "light-mode");

    // Apply appropriate theme class if not root
    if (theme !== "root") {
      document.body.classList.add(`${theme}-mode`);
    }

    // Update icon based on theme
    switch (theme) {
      case "light":
        themeColor.setAttribute("content", "#d7d7d7");
        themeIcon.textContent = "light_mode";
        themeIcon.className = "material-symbols-rounded light";
        break;
      case "dark":
        themeColor.setAttribute("content", "#181818");
        themeIcon.textContent = "dark_mode";
        themeIcon.className = "material-symbols-rounded dark";
        break;
      case "root":
        themeColor.setAttribute("content", "#1b2e8b");
        themeIcon.textContent = "star";
        themeIcon.className = "material-symbols-rounded star";
        break;
    }

    // Save theme preference
    localStorage.setItem("theme", theme);
  };

  // Check for saved user preference, if any, on load
  const savedTheme =
    (localStorage.getItem("theme") as Theme) || prefersDarkScheme ? "dark" : "light";
  updateTheme(savedTheme);

  // Listen for clicks on the toggle button
  themeToggle.addEventListener("click", () => {
    const currentTheme =
      (localStorage.getItem("theme") as Theme) || "root";
    const nextTheme = getNextTheme(currentTheme);
    updateTheme(nextTheme);
  });

  // Listen for changes in the OS-level color scheme preference
  prefersDarkScheme.addEventListener("change", (e) => {
    updateTheme(e.matches ? "dark" : "light");
  });
}

// Initialize theme toggle functionality
setupThemeToggle();
