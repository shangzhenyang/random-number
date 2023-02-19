<script setup lang="ts">
import { ref } from "vue";

import FooterArea from "@/components/FooterArea.vue";
import HistoryPanel from "@/components/HistoryPanel.vue";
import IconBar from "@/components/IconBar.vue";
import NumberArea from "@/components/NumberArea.vue";
import SettingsPanel from "@/components/SettingsPanel.vue";

import type SettingsInfo from "@/types/SettingsInfo";

const isDesktop = window.innerWidth > 1160;

const historyItems = ref([] as string[]);
const names = ref((() => {
	try {
		const names = localStorage.getItem("names");
		if (names) {
			return JSON.parse(names);
		}
		return [];
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
		const settings = localStorage.getItem("settings");
		if (settings) {
			return JSON.parse(settings);
		}
		return defaultValue;
	} catch {
		return defaultValue;
	}
})() as SettingsInfo);
const showHistoryPanel = ref(false);
const showSettingsPanel = ref(isDesktop);

let showHistoryPanelOnce = false;

function addHistoryItem(newItem: string) {
	historyItems.value.push(newItem);
	if (isDesktop && !showHistoryPanelOnce) {
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
		settings.value = newSettings;
		localStorage.setItem("settings", JSON.stringify(newSettings));
	};
}

function setNames(newValue: string[]) {
	names.value = newValue;
	localStorage.setItem("names", JSON.stringify(newValue));

	settings.value.minimum = "1";
	settings.value.maximum = newValue.length === 0 ?
		"60" : newValue.length.toString();
}
</script>

<template>
	<div class="app">
		<HistoryPanel
			v-bind:show="showHistoryPanel"
			v-bind:historyItems="historyItems"
			v-bind:closePanel="() => {
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
					v-bind:names="names"
					v-bind:settings="settings"
					v-bind:addHistoryItem="addHistoryItem"
				/>
			</div>
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
