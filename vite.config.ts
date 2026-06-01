// Vite config — production-tuned for a tiny static SPA.
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		// Modern targets only, for smaller output with no legacy transforms.
		target: "es2022",

		// One shared CSS bundle: cheaper than splitting across both HTML entries.
		cssCodeSplit: false,

		// No sourcemaps in prod (smaller deploy, no info leakage).
		sourcemap: false,

		// Raise the chunk-size warning ceiling; irrelevant for a site this small.
		chunkSizeWarningLimit: 800,

		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				404: resolve(__dirname, "404.html"),
			},
		},
	},
});
