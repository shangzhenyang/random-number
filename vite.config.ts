import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	css: {
		postcss: {
			plugins: [autoprefixer]
		}
	},
	plugins: [
		vue(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Random Number",
				short_name: "Random",
				id: "/",
				theme_color: "#0066cc",
				description: "A random number generator with customizable options including range, repetition, even/odd selection, and alias name labeling.",
				icons: [{
					src: "https://assets.retiehe.com/ysz/avatar.png",
					sizes: "720x720",
					type: "image/png",
					purpose: "any"
				}]
			}
		})
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	}
});
