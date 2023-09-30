import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	build: {
		target: "esnext",
	},
	css: {
		postcss: {
			plugins: [autoprefixer],
		},
	},
	plugins: [
		vue(),
		VitePWA({
			manifest: {
				description: "A random number generator with customizable options including range, repetition, even/odd selection, and alias name labeling.",
				icons: [{
					purpose: "any",
					sizes: "720x720",
					src: "https://www.shangzhenyang.com/images/avatar.png",
					type: "image/png",
				}],
				id: "/",
				name: "Random Number",
				short_name: "Random",
				theme_color: "#0066cc",
			},
			registerType: "autoUpdate",
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
