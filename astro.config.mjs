// @ts-check
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { defineConfig, fontProviders } from "astro/config";

// The theme bootstrap is inlined verbatim (see src/layouts/Base.astro), so its
// hash is computed from the same file and allow-listed in script-src.
const themeInit = readFileSync(new URL("./src/scripts/theme-init.js", import.meta.url), "utf8");
const themeInitHash = /** @type {const} */ (`sha256-${createHash("sha256").update(themeInit).digest("base64")}`);

export default defineConfig({
	site: "https://shivangswain.com",

	// Lossless whitespace removal; avoids JSX-style trimming between inline elements.
	compressHTML: true,

	build: {
		// A single page: inlining the CSS saves a render-blocking round trip.
		inlineStylesheets: "always",
	},

	devToolbar: { enabled: false },

	// No code blocks on the site; Shiki's inline styles would also fight the CSP.
	markdown: { syntaxHighlight: false },

	// Self-hosted, preloaded fonts with metric-matched fallbacks (less layout shift).
	fonts: [
		{
			provider: fontProviders.local(),
			name: "Mona Sans",
			cssVariable: "--font-sans",
			fallbacks: ["system-ui", "sans-serif"],
			options: {
				variants: [
					{
						src: ["./src/assets/fonts/MonaSans-Latin-Variable.woff2"],
						weight: "200 900",
						stretch: "75% 125%",
						style: "normal",
						display: "swap",
					},
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: "Instrument Serif",
			cssVariable: "--font-serif",
			fallbacks: ["Georgia", "serif"],
			options: {
				variants: [
					{
						src: ["./src/assets/fonts/InstrumentSerif-Latin-Italic.woff2"],
						weight: "400",
						style: "italic",
						display: "swap",
					},
				],
			},
		},
	],

	// Astro hashes every script and style it emits into a <meta> CSP, so no
	// 'unsafe-inline' is needed anywhere. frame-ancestors can't be set from a
	// <meta>, so it lives in public/_headers. Cloudflare Web Analytics is the
	// only third party (its beacon is injected at the edge).
	security: {
		csp: {
			algorithm: "SHA-256",
			directives: [
				"default-src 'self'",
				"img-src 'self' data:",
				"font-src 'self'",
				"connect-src 'self' https://cloudflareinsights.com",
				"manifest-src 'self'",
				"object-src 'none'",
				"base-uri 'none'",
				"form-action 'self' mailto:",
				"upgrade-insecure-requests",
			],
			scriptDirective: {
				resources: ["'self'", "https://static.cloudflareinsights.com"],
				hashes: [themeInitHash],
			},
		},
	},
});
