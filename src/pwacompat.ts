/*
 * Loads pwacompat on iPhone and iPad after the page has loaded. It draws the
 * launch image iOS and iPadOS show when the site opens from the Home Screen,
 * from site.webmanifest; other browsers read the manifest themselves.
 * public/assets/pwacompat.min.js is the v3.0.0 release of
 * github.com/shivangswain/pwacompat, pinned by the hash in its sri.json.
 * build.ts strips comments by regex, so use only block or full-line ones.
 */

if (navigator.vendor.startsWith("Apple") && navigator.maxTouchPoints > 1 && !matchMedia("(display-mode: standalone)").matches) {
	addEventListener("load", () => {
		const script = document.createElement("script");
		script.src = "/assets/pwacompat.min.js";
		script.integrity = "sha384-vI0UkC1pINm3BfKxXOj838tHyqq/6yfcXf+mFxhBxPGJS2o2VgAtYpvQ6dYZeFYp";
		script.crossOrigin = "anonymous";
		document.head.append(script);
	}, { once: true });
}
