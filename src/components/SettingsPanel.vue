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
	setInputValue: (key: string) => (event: Event) => void;
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
	<div
		v-if="show"
		class="panel panel-right"
	>
		<TitleBar
			:icons="[
				{
					icon: ['fas', 'xmark'],
					title: $t('close'),
					show: true,
					onClick: closePanel,
				},
			]"
			icon-size="xl"
		>
			<h1>{{ $t("settings") }}</h1>
		</TitleBar>
		<InputBar
			v-for="item in settingsItems"
			:key="item"
			:id="item"
			:is-check-box="typeof settings[item] === 'boolean'"
			:label-value="$t(item)"
			:value="settings[item]"
			:set-value="setInputValue(item)"
		/>
		<NameList
			:names="names"
			:set-names="setNames"
		/>
	</div>
</template>
