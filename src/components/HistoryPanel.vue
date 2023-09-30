<script setup lang="ts">
import TitleBar from "@/components/TitleBar.vue";

const props = defineProps<{
	show: boolean;
	historyItems: string[];
	closePanel: () => void;
	setHistoryItems: (newValue: string[]) => void;
}>();

function deleteHistoryItem(index: number): void {
	const newHistoryItems = [...props.historyItems];
	newHistoryItems.splice(index, 1);
	props.setHistoryItems(newHistoryItems);
}
</script>

<template>
	<div v-if="show" class="panel panel-left">
		<TitleBar v-bind:icons="[
			{
				icon: ['fas', 'delete-left'],
				title: $t('clear'),
				show: historyItems.length > 0,
				onClick: () => {
					setHistoryItems([]);
				}
			},
			{
				icon: ['fas', 'xmark'],
				title: $t('close'),
				show: true,
				onClick: closePanel
			},
		]" icon-size="xl">
			<h1>{{ $t("history") }}</h1>
		</TitleBar>
		<ul>
			<li v-for="item, index in historyItems" v-bind:key="index">
				<div class="list-item-main">{{ item }}</div>
				<button v-on:click="() => deleteHistoryItem(index)">
					{{ $t("delete") }}
				</button>
			</li>
		</ul>
	</div>
</template>
