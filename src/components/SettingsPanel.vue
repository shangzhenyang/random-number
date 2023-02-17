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
		<section>
			<h2>{{ $t("names") }}</h2>
			<ul>
				<li>Name 1</li>
				<li>Name 2</li>
				<li>Name 3</li>
				<li>Name 4</li>
			</ul>
		</section>
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
