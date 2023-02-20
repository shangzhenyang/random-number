import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import eslint from "@rollup/plugin-eslint";
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
		{
			...eslint({
				include: ["src/**/*.{ts,tsx,vue}"]
			}),
			enforce: "pre"
		},
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Random Number",
				short_name: "Random",
				id: "/",
				theme_color: "#0066cc",
				description: "",
				icons: [{
					src: "https://assets.retiehe.com/ysz/avatar.png",
					sizes: "720x720",
					type: "image/png",
					purpose: "any maskable"
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
