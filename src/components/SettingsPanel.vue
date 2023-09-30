<script setup lang="ts">
import InputBar from "@/components/InputBar.vue";
import NameList from "@/components/NameList.vue";
import TitleBar from "@/components/TitleBar.vue";
import { SettingsInfo } from "@/types";

defineProps<{
	show: boolean;
	names: string[];
	settings: SettingsInfo;
	closePanel: () => void;
	setInputValue: (key: string) => ((event: Event) => void);
	setNames: (newValue: string[]) => void;
}>();

const settingsItems: (keyof SettingsInfo)[] = [
	"quantity",
	"minimum",
	"maximum",
	"speed",
	"repeat",
	"oddOnly",
	"evenOnly",
];
</script>

<template>
	<div v-if="show" class="panel panel-right">
		<TitleBar v-bind:icons="[{
			icon: ['fas', 'xmark'],
			title: $t('close'),
			show: true,
			onClick: closePanel
		}]" icon-size="xl">
			<h1>{{ $t("settings") }}</h1>
		</TitleBar>
		<InputBar v-for="item in settingsItems" v-bind:key="item" v-bind:id="item" v-bind:is-check-box="typeof settings[item] === 'boolean'" v-bind:label-value="$t(item)" v-bind:value="settings[item]" v-bind:set-value="setInputValue(item)" />
		<NameList v-bind:names="names" v-bind:set-names="setNames" />
	</div>
</template>
