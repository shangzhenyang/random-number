import App from "@/App.vue";
import "@/style.css";
import translationEnUs from "@/translations/en-us.json";
import translationZhCn from "@/translations/zh-cn.json";
import translationZhTw from "@/translations/zh-tw.json";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
	faClockRotateLeft,
	faDeleteLeft,
	faDownload,
	faGear,
	faUpload,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import i18next, { t } from "i18next";
import I18NextVue from "i18next-vue";
import { ComponentOptions, createApp } from "vue";
import VueGtag from "vue-gtag";

const i18nResources = {
	"en-US": {
		translation: translationEnUs,
	},
	"zh-CN": {
		translation: translationZhCn,
	},
	"zh-TW": {
		translation: translationZhTw,
	},
};

const lang = ((): string => {
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

await i18next.init({
	fallbackLng: "en-US",
	interpolation: {
		escapeValue: false,
	},
	lng: lang,
	resources: i18nResources,
});

document.documentElement.lang = lang;
document.title = t("randomNumberByShangzhen");

library.add(
	faClockRotateLeft,
	faDeleteLeft,
	faDownload,
	faGear,
	faGithub,
	faUpload,
	faXmark,
);

createApp(App as ComponentOptions)
	.component("font-awesome-icon", FontAwesomeIcon)
	.use(I18NextVue, { i18next: i18next })
	.use(VueGtag, {
		config: {
			id: "G-VLJ52KB4ZZ",
		},
	})
	.mount("#app");
