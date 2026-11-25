/**
 * Builds dist/ from src/ and public/. Each src/*.html page gets style.css,
 * theme.ts and a subset of its fonts inlined, then is minified, so a page is
 * one response that fits in the first TCP round trip.
 *
 *   node build.ts                  build (fails if a page is over budget)
 *   node build.ts --serve [--host] build, serve on :4173, rebuild on changes
 */
import { createHash } from "node:crypto";
import { cpSync, readdirSync, readFileSync, rmSync, watch, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { stripTypeScriptTypes } from "node:module";
import { networkInterfaces } from "node:os";
import { extname, join } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";
import subsetFont from "subset-font";

const SRC = "src";
const OUT = "dist";
const PORT = 4173;

// Bytes deliverable in TCP's initial congestion window (10 segments).
const BUDGET = 14_000;

const read = (file: string): string => readFileSync(join(SRC, file), "utf8");

// Comments starting /*! (licence notices) are kept.
const css = (file: string): string =>
	read(file)
		.replace(/\/\*(?!!)[\s\S]*?\*\//g, "")
		.replace(/\s+/g, " ")
		.replace(/\s*([{};,>])\s*/g, "$1")
		.replace(/:\s+/g, ":")
		.replace(/;}/g, "}")
		.trim();

// Drops comments, indentation and blank lines; keeps newlines for ASI.
const js = (file: string): string =>
	stripTypeScriptTypes(read(file))
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/^\s*\/\/.*$/gm, "")
		.split("\n")
		.map((line) => line.trim().replace(/\s{2,}/g, " "))
		.filter(Boolean)
		.join("\n");

// Characters a page renders: <body> text and CSS `content` strings, plus "0",
// whose width defines the `ch` unit.
function characters(html: string, sheet: string): string {
	const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" };
	const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "")
		.replace(/<[^>]*>/g, "")
		.replace(/&(amp|lt|gt|quot|#39);/g, (_, name: string) => entities[name]!);
	const generated = [...sheet.matchAll(/content:"([^"]*)"/g)].map(([, text]) => text).join("");
	return [...new Set(` 0${body}${generated}`.replace(/\s/g, " "))].sort().join("");
}

// Replaces each font url() with an inline woff2 subset of `text`: unhinted,
// without layout closure, keeping name ID 13 (the OFL licence text).
async function inlineFonts(sheet: string, text: string): Promise<{ sheet: string; bytes: number }> {
	let bytes = 0;
	for (const [match, file] of sheet.matchAll(/url\("?([^")]+\.(?:otf|ttf))"?\)/g)) {
		const woff2 = await subsetFont(readFileSync(join(SRC, file!)), text, {
			targetFormat: "woff2",
			noHinting: true,
			noLayoutClosure: true,
			preserveNameIds: [13],
		});
		bytes += woff2.length;
		sheet = sheet.replace(match, () => `url(data:font/woff2;base64,${woff2.toString("base64")})format("woff2")`);
	}
	return { sheet, bytes };
}

// Inline scripts must run where they are, before first paint, so they opt
// out of Cloudflare's Rocket Loader, which would otherwise defer them.
const SCRIPT = '<script data-cfasync="false">';

// Minifies the markup (whitespace spanning a line break is formatting), then
// inlines the scripts and stylesheet.
async function page(file: string): Promise<{ html: string; font: number }> {
	let html = read(file)
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/>\s*\n\s*</g, "><")
		.replace(/\s*\n\s*/g, " ")
		.trim()
		.replace(/<script src="([^"]+\.ts)"><\/script>/g, (_, src: string) => `${SCRIPT}${js(src)}</script>`);

	let font = 0;
	const link = html.match(/<link rel="stylesheet" href="([^"]+)">/);
	if (link) {
		const sheet = css(link[1]!);
		const inlined = await inlineFonts(sheet, characters(html, sheet));
		font = inlined.bytes;
		html = html.replace(link[0], () => `<style>${inlined.sheet}</style>`);
	}
	return { html, font };
}

const kB = (bytes: number): string => `${(bytes / 1000).toFixed(1)} kB`.padStart(8);

async function build(): Promise<boolean> {
	rmSync(OUT, { recursive: true, force: true });
	cpSync("public", OUT, { recursive: true });

	let ok = true;
	const hashes = new Set<string>();
	for (const file of readdirSync(SRC).filter((f) => f.endsWith(".html"))) {
		const { html, font } = await page(file);
		writeFileSync(join(OUT, file), html);
		for (const part of html.split(SCRIPT).slice(1)) {
			const code = part.slice(0, part.indexOf("</script>"));
			hashes.add(`'sha256-${createHash("sha256").update(code).digest("base64")}'`);
		}

		// Gzip is the largest encoding a browser receives.
		const gz = gzipSync(html).length;
		ok &&= gz <= BUDGET;
		console.log(
			`${file.padEnd(11)}${kB(Buffer.byteLength(html))} raw${kB(gz)} gzip${kB(brotliCompressSync(html).length)} brotli` +
				`  (font${kB(font)})` +
				(gz > BUDGET ? `  ✗ over the ${kB(BUDGET).trim()} budget` : ""),
		);
	}

	// Allows exactly the inline scripts built above; CSP2+ browsers then
	// ignore 'unsafe-inline', which remains for older ones.
	const headers = join(OUT, "_headers");
	const csp = /^(\s*Content-Security-Policy:.*\bscript-src\b[^;\n]*)/m;
	writeFileSync(headers, readFileSync(headers, "utf8").replace(csp, (directive) => `${directive} ${[...hashes].join(" ")}`));
	return ok;
}

// Serves dist/ locally, or on every interface with --host.
function serve(lan: boolean): void {
	// Applies public/_redirects, read per request so edits need no restart.
	const redirect = (path: string): string | undefined =>
		readFileSync("public/_redirects", "utf8")
			.split("\n")
			.map((line) => line.trim().split(/\s+/))
			.find(([from, to]) => from === path && to)?.[1];
	const types: Record<string, string> = {
		".asc": "text/plain; charset=utf-8",
		".html": "text/html; charset=utf-8",
		".ico": "image/x-icon",
		".js": "text/javascript; charset=utf-8",
		".map": "application/json",
		".pdf": "application/pdf",
		".png": "image/png",
		".svg": "image/svg+xml",
		".txt": "text/plain; charset=utf-8",
		".webmanifest": "application/manifest+json",
	};
	// Undefined while missing, e.g. mid-rebuild.
	const load = (file: string): Buffer | undefined => {
		try {
			return readFileSync(file);
		} catch {
			return undefined;
		}
	};

	createServer((req, res) => {
		// URL parsing resolves ../ segments, keeping requests inside dist/.
		const path = new URL(req.url ?? "/", "http://localhost").pathname;
		const to = redirect(path);
		if (to) return void res.writeHead(302, { location: to }).end();
		const file = join(OUT, path.endsWith("/") ? `${path}index.html` : path);
		const body = load(file);
		if (body) return void res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(body);
		res.writeHead(404, { "content-type": types[".html"] }).end(load(join(OUT, "404.html")) ?? "Not found");
	}).listen(PORT, lan ? "0.0.0.0" : "localhost", () => {
		console.log(`\n→ http://localhost:${PORT}`);
		if (!lan) return console.log("  (--host to open it to your network, e.g. to test on a phone)");
		for (const net of Object.values(networkInterfaces()).flat()) {
			if (net?.family === "IPv4" && !net.internal) console.log(`→ http://${net.address}:${PORT}`);
		}
	});

	// Debounced, as editors fire several events per save; failures are logged.
	let timer: ReturnType<typeof setTimeout> | undefined;
	for (const dir of [SRC, "public"]) {
		watch(dir, { recursive: true }, () => {
			clearTimeout(timer);
			timer = setTimeout(() => build().catch(console.error), 50);
		});
	}
}

if (process.argv.includes("--serve")) {
	await build();
	serve(process.argv.includes("--host"));
} else if (!(await build())) {
	process.exitCode = 1;
}
