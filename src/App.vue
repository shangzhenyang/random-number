<script setup lang="ts">
import { ref } from "vue";

import FooterArea from "@/components/FooterArea.vue";
import HistoryPanel from "@/components/HistoryPanel.vue";
import IconBar from "@/components/IconBar.vue";
import NumberArea from "@/components/NumberArea.vue";
import SettingsPanel from "@/components/SettingsPanel.vue";

import type SettingsInfo from "@/types/SettingsInfo";

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
const settings = ref({
	quantity: "1",
	minimum: "1",
	maximum: "60",
	speed: "100"
} as SettingsInfo);
const showHistory = ref(false);
const showSettingsPanel = ref(true);

function addHistoryItem(newItem: string) {
	showHistory.value = true;
	historyItems.value.push(newItem);
}

function openGitHub() {
	window.open("https://github.com/shangzhenyang/random-number");
}

function setInputValue(key: string): ((evt: Event) => void) {
	const hasMaxLimit = ["quantity", "speed"];
	return (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		if (hasMaxLimit.includes(key)) {
			if (parseInt(target.value) > 100) {
				return;
			}
		}
		const newSettings = { ...settings.value };
		newSettings[key as keyof typeof newSettings] = target.value;
		settings.value = newSettings;
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
			v-bind:show="showHistory"
			v-bind:historyItems="historyItems"
			v-bind:closePanel="() => {
				showHistory = false;
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
	bottom: 20px;
	position: fixed;
	right: 20px;
}

.number-areas {
	display: flex;
	gap: 30px;
	margin: 0 auto;
	padding: 30px;
}
</style>
