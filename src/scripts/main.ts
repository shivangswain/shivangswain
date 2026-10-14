/**
 * Progressive enhancements. The page is complete without JavaScript: content
 * is never hidden behind it, scroll effects are pure CSS, and the contact form
 * falls back to a plain mailto: submit. This adds the theme switcher, the
 * hero name's cursor effect, the Bengaluru clock and the pre-filled email draft.
 */

type Theme = "light" | "dark" | "blue";

const THEMES: readonly Theme[] = ["light", "dark", "blue"];
const STORAGE_KEY = "theme";

// Browser/PWA chrome colour per theme; keep in sync with the tokens in global.css.
const THEME_COLOR: Record<Theme, string> = {
	light: "#f4f4ed",
	dark: "#0b0b0a",
	blue: "#1b30c4",
};

const THEME_NAME: Record<Theme, string> = {
	light: "light",
	dark: "dark",
	blue: "electric blue",
};

const root = document.documentElement;
const prefersLight = matchMedia("(prefers-color-scheme: light)");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);
const systemTheme = (): Theme => (prefersLight.matches ? "light" : "dark");
const currentTheme = (): Theme => (isTheme(root.dataset.theme) ? root.dataset.theme : systemTheme());
const nextTheme = (theme: Theme): Theme => THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];

function storedTheme(): Theme | null {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return value === "root" ? "blue" : isTheme(value) ? value : null;
	} catch {
		return null;
	}
}

function renderTheme(theme: Theme): void {
	root.dataset.theme = theme;
	for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
		meta.setAttribute("content", THEME_COLOR[theme]);
	}
	for (const button of document.querySelectorAll("[data-theme-toggle]")) {
		button.setAttribute(
			"aria-label",
			`Colour theme: ${THEME_NAME[theme]}. Switch to ${THEME_NAME[nextTheme(theme)]}.`,
		);
	}
}

function setupTheme(): void {
	renderTheme(currentTheme());

	for (const button of document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]")) {
		button.addEventListener("click", () => {
			const theme = nextTheme(currentTheme());
			try {
				localStorage.setItem(STORAGE_KEY, theme);
			} catch {
				/* private mode / storage disabled: the switch still works for this visit */
			}

			if (!document.startViewTransition || reducedMotion.matches) {
				renderTheme(theme);
				return;
			}

			// Wipe the new theme in as a circle growing out of the button.
			const { left, top, width, height } = button.getBoundingClientRect();
			root.style.setProperty("--wipe-x", `${left + width / 2}px`);
			root.style.setProperty("--wipe-y", `${top + height / 2}px`);
			// Rapid clicks skip the running transition, which rejects `ready`; the
			// theme itself is still applied, so the rejection is safe to ignore.
			document.startViewTransition(() => renderTheme(theme)).ready.catch(() => {});
		});
	}

	// Follow the OS until the visitor picks a theme themselves.
	prefersLight.addEventListener("change", () => {
		if (!storedTheme()) renderTheme(systemTheme());
	});
}

function setupClock(): void {
	const clocks = document.querySelectorAll<HTMLTimeElement>("[data-clock]");
	if (clocks.length === 0) return;

	const format = new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "Asia/Kolkata",
	});

	const tick = (): void => {
		const now = new Date();
		const text = format.format(now);
		for (const clock of clocks) {
			clock.textContent = text;
			clock.dateTime = now.toISOString();
		}
	};

	tick();
	setInterval(tick, 10_000);
}

/*
 * Hero name: letters near the cursor thin out and shift colour, weighted by
 * distance, then ease back as it moves away (after Julian Fella's variable
 * font weight hover). Weight follows distance rather than :hover, so a resting
 * cursor never flips a letter on and off as its width changes. Fine pointers
 * only, and off for reduced motion.
 */
function setupHeroWeight(): void {
	const hero = document.querySelector<HTMLElement>(".hero");
	const letters = [...document.querySelectorAll<HTMLElement>(".hero-line .ch")];
	if (!hero || letters.length === 0) return;
	if (!matchMedia("(hover: hover) and (pointer: fine)").matches || reducedMotion.matches) return;

	const HEAVY = 900;
	const LIGHT = 250;
	let pointer: { x: number; y: number } | null = null;
	let frame = 0;

	const update = (): void => {
		frame = 0;
		// Reach scales with the type, so about three letters respond at once.
		const radius = parseFloat(getComputedStyle(letters[0]).fontSize) * 1.4;
		for (const letter of letters) {
			let near = 0;
			if (pointer) {
				const box = letter.getBoundingClientRect();
				const distance = Math.hypot(
					pointer.x - (box.left + box.width / 2),
					pointer.y - (box.top + box.height / 2),
				);
				const t = Math.max(0, 1 - distance / radius);
				near = t * t * (3 - 2 * t); // smoothstep, for a soft falloff
			}
			letter.style.setProperty("--wght", String(Math.round(HEAVY - (HEAVY - LIGHT) * near)));
			letter.style.setProperty("--near", `${Math.round(near * 100)}%`);
		}
	};

	const schedule = (): void => {
		if (!frame) frame = requestAnimationFrame(update);
	};

	hero.addEventListener("pointermove", (event) => {
		pointer = { x: event.clientX, y: event.clientY };
		schedule();
	});
	hero.addEventListener("pointerleave", () => {
		pointer = null;
		schedule();
	});
	// Letters move under a resting cursor while the page scrolls.
	addEventListener("scroll", () => pointer && schedule(), { passive: true });
}

/* Compose a pre-filled email draft from the form. Nothing is sent or stored by this site. */
function setupContactForm(): void {
	const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
	if (!form) return;

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const data = new FormData(form);
		const field = (name: string): string => String(data.get(name) ?? "").trim();
		const name = field("name");

		const subject = encodeURIComponent(`Hello from ${name} (via shivangswain.com)`);
		const body = encodeURIComponent(`${field("message")}\n\n${name}\n${field("email")}`);
		window.location.href = `${form.action.split("?")[0]}?subject=${subject}&body=${body}`;
	});
}

setupTheme();
setupHeroWeight();
setupClock();
setupContactForm();
