<script setup lang="ts">
import InputBar from "@/components/InputBar.vue";
import NameList from "@/components/NameList.vue";

import type SettingsInfo from "@/types/SettingsInfo";

defineProps<{
	show: boolean;
	names: string[];
	settings: SettingsInfo;
	setInputValue: (key: string) => ((evt: Event) => void);
	setNames: (newValue: string[]) => void;
}>();
</script>

<template>
	<div v-if="show" class="panel">
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
		<NameList
			v-bind:names="names"
			v-bind:setNames="setNames"
		/>
	</div>
</template>

<style scoped>
h2 {
	font-size: 20px;
	font-weight: normal;
}

.panel {
	border-left: 1px solid rgba(0, 0, 0, .2);
}

@media (prefers-color-scheme: dark) {
	.panel {
		border-left-color: rgba(255, 255, 255, .2);
	}
}
</style>
