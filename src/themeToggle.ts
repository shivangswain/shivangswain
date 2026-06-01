/**
 * Theme toggle. Cycles light → dark → root (default blue) on click, persists to
 * localStorage, and follows the OS preference until the user picks one. The
 * pre-paint FOUC guard lives inline in index.html / 404.html; this handles the
 * runtime UI: icon swap, theme-color meta, and OS-change sync.
 */

type Theme = "light" | "dark" | "root";

const STORAGE_KEY = "theme";
const ORDER: readonly Theme[] = ["light", "dark", "root"] as const;

// Address-bar / PWA chrome colour per theme.
const META_COLOR: Record<Theme, string> = {
	light: "#d7d7d7",
	dark: "#181818",
	root: "#1b2e8b",
};

const ICON: Record<Theme, string> = {
	light: "light_mode",
	dark: "dark_mode",
	root: "star",
};

function readStoredTheme(): Theme | null {
	try {
		const v = localStorage.getItem(STORAGE_KEY);
		return v === "light" || v === "dark" || v === "root" ? v : null;
	} catch {
		return null;
	}
}

function systemTheme(): Theme {
	return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setupThemeToggle(): void {
	const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
	const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement | null;
	const themeIcon = themeToggle?.querySelector("i") as HTMLElement | null;
	if (!themeToggle || !themeIcon) return;

	const root = document.documentElement;
	const body = document.body;
	const prefersDark = matchMedia("(prefers-color-scheme: dark)");

	const applyTheme = (theme: Theme): void => {
		// Classes live on <html> (so the inline bootstrap can set them pre-<body>);
		// mirrored to <body> so `body.dark-mode .x` selectors also work.
		root.classList.remove("light-mode", "dark-mode");
		body.classList.remove("light-mode", "dark-mode");
		if (theme !== "root") {
			root.classList.add(`${theme}-mode`);
			body.classList.add(`${theme}-mode`);
		}

		themeColor?.setAttribute("content", META_COLOR[theme]);
		themeIcon.textContent = ICON[theme];
		themeIcon.className = `material-symbols-rounded ${theme}`;

		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			/* ignore — incognito / quota */
		}
	};

	// Sync the UI to whatever the pre-paint script picked.
	applyTheme(readStoredTheme() ?? systemTheme());

	// Enable colour transitions only after first paint, so the page doesn't
	// animate from its pre-themed state on load.
	requestAnimationFrame(() => body.classList.add("theme-ready"));

	themeToggle.addEventListener("click", () => {
		const current = readStoredTheme() ?? "root";
		const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
		applyTheme(next);
	});

	// Follow OS-level changes only when the user hasn't pinned a choice.
	prefersDark.addEventListener("change", (e) => {
		if (readStoredTheme() === null) applyTheme(e.matches ? "dark" : "light");
	});
}

setupThemeToggle();
