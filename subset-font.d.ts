// Types for subset-font, which ships none.
// https://github.com/papandreou/subset-font#subsetfontbuffer-text-options-promisebuffer
declare module "subset-font" {
	export default function subsetFont(
		font: Uint8Array,
		text: string,
		options?: {
			targetFormat?: "sfnt" | "woff" | "woff2";
			/** Name IDs to keep on top of HarfBuzz's defaults (0–6). */
			preserveNameIds?: number[];
			noLayoutClosure?: boolean;
			noHinting?: boolean;
			glyphNames?: boolean;
		},
	): Promise<Buffer>;
}
