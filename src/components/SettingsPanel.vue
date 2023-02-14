<script setup lang="ts">
import InputBar from "@/components/InputBar.vue";

import type SettingsInfo from "@/types/SettingsInfo";

defineProps<{
	show: boolean;
	settings: SettingsInfo;
	setInputValue: (key: string) => ((evt: Event) => void);
}>();
</script>

<template>
	<aside v-if="show">
		<h1>{{ $t("settings") }}</h1>
		<InputBar
			v-for="key in Object.keys(settings)"
			v-bind:key="key"
			v-bind:id="key"
			v-bind:labelValue="$t(key)"
			type="number"
			v-bind:value="settings[key as keyof typeof settings]"
			v-bind:setValue="setInputValue(key)"
		/>
	</aside>
</template>

<style scoped>
aside {
	border-left: 1px solid rgba(0, 0, 0, .2);
	display: flex;
	flex-direction: column;
	gap: 10px;
	height: 100%;
	padding: 20px;
	width: 500px;
}

h1 {
	font-size: 24px;
	font-weight: normal;
	margin: 0;
}

@media (prefers-color-scheme: dark) {
	aside {
		border-left-color: rgba(255, 255, 255, .2);
	}
}
</style>
