/*
 * Theme bootstrap and toggle, inlined into <head> by build.ts so it runs
 * before first paint. Sets the saved theme, else the OS preference, as the
 * <html> class; the #theme button cycles dark → light → blue.
 * build.ts strips comments by regex, so use only block or full-line ones.
 */

type Theme = "dark" | "light" | "blue";

const THEMES: readonly Theme[] = ["dark", "light", "blue"];
const KEY = "theme";

// Browser UI colour per theme, matching --bg in style.css. The page has one
// theme-color meta per OS scheme (for no-JS visitors); all get the theme's.
const CHROME: Record<Theme, string> = { dark: "#050505", light: "#f5f5f5", blue: "#1c2f8c" };

const root = document.documentElement;
const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
const lightOS = matchMedia("(prefers-color-scheme: light)");
let current: Theme;

function saved(): Theme | undefined {
	try {
		const value = localStorage.getItem(KEY);
		return THEMES.find((theme) => theme === value);
	} catch {
		return undefined; /* storage blocked */
	}
}

function system(): Theme {
	return lightOS.matches ? "light" : "dark";
}

function apply(theme: Theme): void {
	current = theme;
	root.className = theme;
	for (const meta of metas) meta.content = CHROME[theme];
}

apply(saved() ?? system());

// Follows the OS until a theme is chosen.
lightOS.addEventListener("change", () => {
	if (!saved()) apply(system());
});

// Delegated, as the button is parsed after this script runs.
addEventListener("click", (event) => {
	if (!(event.target instanceof Element && event.target.closest("#theme"))) return;
	const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
	apply(next);
	try {
		localStorage.setItem(KEY, next);
	} catch {
		/* storage blocked: applies to this visit only */
	}
});
