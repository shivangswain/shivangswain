/**
 * Main entry for the portfolio page: theme toggle plus the scroll-driven
 * behaviours (reveal-on-scroll, dot-nav highlighting) and the contact form.
 * Everything degrades gracefully — content is fully visible without JS
 * (reveal styles are gated behind html.js) and the form is backed by a plain
 * mailto: link in the copy above it.
 */

import "./themeToggle";

/* Reveal-on-scroll: flip .in-view once, then unobserve (no work on re-scroll). */
function setupReveals(): void {
	const targets = document.querySelectorAll<HTMLElement>(".reveal");
	if (targets.length === 0) return;

	if (!("IntersectionObserver" in window)) {
		targets.forEach((el) => el.classList.add("in-view"));
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add("in-view");
					observer.unobserve(entry.target);
				}
			}
		},
		{ rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
	);

	targets.forEach((el) => observer.observe(el));
}

/* Dot-nav: mark the link of the most-visible section as active. */
function setupSectionNav(): void {
	const links = document.querySelectorAll<HTMLAnchorElement>(".section-nav a");
	const sections = document.querySelectorAll<HTMLElement>("main section[id]");
	if (links.length === 0 || sections.length === 0 || !("IntersectionObserver" in window)) return;

	const byId = new Map<string, HTMLAnchorElement>();
	links.forEach((a) => byId.set(a.hash.slice(1), a));

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				links.forEach((a) => a.classList.remove("active"));
				byId.get(entry.target.id)?.classList.add("active");
			}
		},
		// A narrow band around the viewport centre decides the active section,
		// so exactly one section wins even when two are partially visible.
		{ rootMargin: "-45% 0px -45% 0px" },
	);

	sections.forEach((s) => observer.observe(s));
}

/* Contact form: compose a mailto: draft from the fields. No network, no storage. */
function setupContactForm(): void {
	const form = document.getElementById("contact-form") as HTMLFormElement | null;
	if (!form) return;

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const data = new FormData(form);
		const name = String(data.get("name") ?? "").trim();
		const email = String(data.get("email") ?? "").trim();
		const message = String(data.get("message") ?? "").trim();

		const subject = encodeURIComponent(`Hello from ${name} (via shivangswain.com)`);
		const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
		window.location.href = `mailto:me@shivangswain.com?subject=${subject}&body=${body}`;
	});
}

setupReveals();
setupSectionNav();
setupContactForm();
