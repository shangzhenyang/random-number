<script setup lang="ts">
import { ref } from "vue";

import CornerIcons from "@/components/CornerIcons.vue";
import FooterArea from "@/components/FooterArea.vue";
import NumberArea from "@/components/NumberArea.vue";
import SettingsPanel from "@/components/SettingsPanel.vue";

const showSettingsPanel = ref(true);

function openGitHub() {
	window.open("https://github.com/shangzhenyang/random-number");
}
</script>

<template>
	<div class="app">
		<main>
			<NumberArea />
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
		<SettingsPanel v-bind:show="showSettingsPanel" />
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
