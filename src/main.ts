import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
	faClockRotateLeft,
	faDeleteLeft,
	faDownload,
	faGear,
	faUpload,
	faXmark
} from "@fortawesome/free-solid-svg-icons";
import i18next from "i18next";
import I18NextVue from "i18next-vue";
import VueGtag from "vue-gtag";

import "@/style.css";
import App from "@/App.vue";

import translationEnUs from "./translations/en-us.json";
import translationZhCn from "./translations/zh-cn.json";
import translationZhTw from "./translations/zh-tw.json";

const i18nResources = {
	"en-US": {
		translation: translationEnUs
	},
	"zh-CN": {
		translation: translationZhCn
	},
	"zh-TW": {
		translation: translationZhTw
	}
};

const lang = (() => {
	if (/^(yue|zh)(-cn|-hans(-[a-z]+)?)?$/i.test(navigator.language)) {
		return "zh-CN";
	} else if (
		navigator.language.startsWith("zh") ||
		navigator.language.startsWith("yue")
	) {
		return "zh-TW";
	} else {
		return "en-US";
	}
})();

i18next.init({
	resources: i18nResources,
	lng: lang,
	fallbackLng: "en-US",
	interpolation: {
		escapeValue: false
	}
});
library.add(
	faClockRotateLeft,
	faDeleteLeft,
	faDownload,
	faGear,
	faGithub,
	faUpload,
	faXmark
);

document.documentElement.lang = lang;
document.title = i18next.t("randomNumber");

createApp(App)
	.component("font-awesome-icon", FontAwesomeIcon)
	.use(I18NextVue, { i18next })
	.use(VueGtag, {
		config: {
			id: "G-VLJ52KB4ZZ"
		}
	})
	.mount("#app");
