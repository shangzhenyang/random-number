<script setup lang="ts">
import { ref } from "vue";

import CornerIcons from "@/components/CornerIcons.vue";
import FooterArea from "@/components/FooterArea.vue";
import NumberArea from "@/components/NumberArea.vue";
import SettingsPanel from "@/components/SettingsPanel.vue";

import type SettingsInfo from "@/types/SettingsInfo";

const settings = ref({
	quantity: "1",
	minimum: "1",
	maximum: "60",
	speed: "10"
} as SettingsInfo);
const showSettingsPanel = ref(true);

function openGitHub() {
	window.open("https://github.com/shangzhenyang/random-number");
}

function setInputValue(key: string): ((evt: Event) => void) {
	return (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		const newSettings = { ...settings.value };
		newSettings[key as keyof typeof newSettings] = target.value;
		settings.value = newSettings;
	};
}
</script>

<template>
	<div class="app">
		<main>
			<NumberArea v-bind:settings="settings" />
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
	justify-content: center;
	width: 100%;
}

.app {
	display: flex;
	height: 100%;
}
</style>
