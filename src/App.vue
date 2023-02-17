<script setup lang="ts">
import { ref } from "vue";

import CornerIcons from "@/components/CornerIcons.vue";
import FooterArea from "@/components/FooterArea.vue";
import HistoryPanel from "@/components/HistoryPanel.vue";
import NumberArea from "@/components/NumberArea.vue";
import SettingsPanel from "@/components/SettingsPanel.vue";

import type SettingsInfo from "@/types/SettingsInfo";

const historyItems = ref([] as string[]);
const settings = ref({
	quantity: "1",
	minimum: "1",
	maximum: "60",
	speed: "100"
} as SettingsInfo);
const showHistory = ref(false);
const showSettingsPanel = ref(true);

function addHistoryItem(item: string) {
	showHistory.value = true;
	historyItems.value.push(item);
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
</script>

<template>
	<div class="app">
		<HistoryPanel
			v-bind:historyItems="historyItems"
			v-bind:show="showHistory"
		/>
		<main>
			<div class="number-areas">
				<NumberArea
					v-for="index in parseInt(settings.quantity)"
					v-bind:key="index"
					v-bind:settings="settings"
					v-bind:addHistoryItem="addHistoryItem"
				/>
			</div>
			<FooterArea />
			<CornerIcons v-bind:items="[{
				icon: ['fab', 'github'],
				title: 'GitHub',
				onClick: openGitHub
			}, {
				icon: ['fas', 'gear'],
				title: $t('settings'),
				onClick: () => {
					showSettingsPanel = !showSettingsPanel;
				}
			}]" />
		</main>
		<SettingsPanel
			v-bind:show="showSettingsPanel"
			v-bind:settings="settings"
			v-bind:setInputValue="setInputValue"
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

.number-areas {
	display: flex;
	gap: 30px;
	margin: 0 auto;
	padding: 30px;
}
</style>
