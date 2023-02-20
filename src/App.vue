<script setup lang="ts">
import { ref } from "vue";

import FooterArea from "@/components/FooterArea.vue";
import HistoryPanel from "@/components/HistoryPanel.vue";
import IconBar from "@/components/IconBar.vue";
import NumberArea from "@/components/NumberArea.vue";
import SettingsPanel from "@/components/SettingsPanel.vue";

import type SettingsInfo from "@/types/SettingsInfo";

const DESKTOP_WIDTH = 1160;

const names = ref((() => {
	try {
		const storedNames = localStorage.getItem("names");
		return storedNames ? JSON.parse(storedNames) : [];
	} catch {
		return [];
	}
})() as string[]);

const settings = ref((() => {
	const defaultValue = {
		quantity: "1",
		minimum: "1",
		maximum: "60",
		speed: "100",
		repeat: true,
		oddOnly: false,
		evenOnly: false
	};
	try {
		const storedSettings = localStorage.getItem("settings");
		if (!storedSettings) {
			return defaultValue;
		}
		const json = JSON.parse(storedSettings) as SettingsInfo;
		if (
			!json.minimum ||
			!json.maximum ||
			parseInt(json.minimum) >= parseInt(json.maximum)
		) {
			json.minimum = defaultValue.minimum;
			json.maximum = defaultValue.maximum;
		}
		return json;
	} catch {
		return defaultValue;
	}
})() as SettingsInfo);

const historyItems = ref([] as string[]);
const showHistoryPanel = ref(false);
const showSettingsPanel = ref(window.innerWidth > DESKTOP_WIDTH);

let showHistoryPanelOnce = false;

function addHistoryItem(newItem: string) {
	historyItems.value.push(newItem);
	if (!showHistoryPanelOnce && window.innerWidth > DESKTOP_WIDTH) {
		showHistoryPanel.value = true;
		showHistoryPanelOnce = true;
	}
}

function openGitHub() {
	window.open("https://github.com/shangzhenyang/random-number");
}

function setInputValue(key: string): ((evt: Event) => void) {
	return (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		const newSettings = { ...settings.value };
		if (target.type === "checkbox") {
			const conflicts = {
				oddOnly: "evenOnly",
				evenOnly: "oddOnly"
			};
			const conflict = conflicts[key as keyof typeof conflicts];
			if (conflict) {
				(newSettings[conflict as keyof typeof newSettings] as boolean) =
					false;
			}
			(newSettings[key as keyof typeof newSettings] as boolean) =
				target.checked;
			if (!newSettings.repeat) {
				historyItems.value = [];
			}
		} else {
			const hasMaxLimit = ["quantity", "speed"];
			if (hasMaxLimit.includes(key)) {
				if (parseInt(target.value) > 100) {
					return;
				}
			}
			(newSettings[key as keyof typeof newSettings] as string) =
				target.value;
		}
		setSettings(newSettings);
	};
}

function setNames(newValue: string[]) {
	names.value = newValue;
	localStorage.setItem("names", JSON.stringify(newValue));

	const newSettings = { ...settings.value };
	newSettings.minimum = "1";
	newSettings.maximum = newValue.length === 0 ?
		"60" : newValue.length.toString();
	setSettings(newSettings);
}

function setSettings(newValue: SettingsInfo) {
	settings.value = newValue;
	showSettingsPanel.value = true;
	localStorage.setItem("settings", JSON.stringify(newValue));
}
</script>

<template>
	<div class="app">
		<HistoryPanel
			v-bind:show="showHistoryPanel"
			v-bind:history-items="historyItems"
			v-bind:close-panel="() => {
				showHistoryPanel = false;
			}"
			v-bind:set-history-items="(newValue) => {
				historyItems = newValue;
			}"
		/>
		<main>
			<div class="number-areas">
				<NumberArea
					v-for="index in parseInt(settings.quantity)"
					v-bind:key="index"
					v-bind:history-items="historyItems"
					v-bind:names="names"
					v-bind:settings="settings"
					v-bind:addHistoryItem="addHistoryItem"
					v-bind:set-settings="setSettings"
				/>
			</div>
		</main>
		<SettingsPanel
			v-bind:show="showSettingsPanel"
			v-bind:names="names"
			v-bind:settings="settings"
			v-bind:closePanel="() => {
				showSettingsPanel = false;
			}"
			v-bind:setInputValue="setInputValue"
			v-bind:setNames="setNames"
		/>
		<FooterArea />
		<IconBar
			class="corner-icons"
			v-bind:items="[{
				icon: ['fas', 'gear'],
				show: !showSettingsPanel,
				title: $t('settings'),
				onClick: () => {
					showSettingsPanel = !showSettingsPanel;
				}
			}, {
				icon: ['fas', 'clock-rotate-left'],
				show: !showHistoryPanel,
				title: $t('history'),
				onClick: () => {
					showHistoryPanel = !showHistoryPanel;
				}
			}, {
				icon: ['fab', 'github'],
				show: true,
				title: 'GitHub',
				onClick: openGitHub
			}]"
			size="xl"
		/>
	</div>
</template>

<style scoped>
main {
	align-items: center;
	display: flex;
	overflow: auto;
	width: 100%;
}

.app {
	display: flex;
	height: 100%;
}

.corner-icons {
	backdrop-filter: blur(10px);
	bottom: 0;
	right: 0;
	padding: 20px;
	position: fixed;
}

.number-areas {
	display: flex;
	gap: 30px;
	margin: 0 auto;
	padding: 30px;
}
</style>
