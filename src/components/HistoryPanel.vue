<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
	show: boolean;
	historyItems: string[];
}>();

const historyItemsReversed = computed(() => {
	return [...props.historyItems].reverse();
});
</script>

<template>
	<div v-if="show" class="panel">
		<h1>{{ $t("history") }}</h1>
		<ul>
			<li
				v-for="item, index in historyItemsReversed"
				v-bind:key="index">
				{{ item }}
			</li>
		</ul>
	</div>
</template>

<style scoped>
.panel {
	border-right: 1px solid rgba(0, 0, 0, .2);
}

@media (prefers-color-scheme: dark) {
	.panel {
		border-right-color: rgba(255, 255, 255, .2);
	}
}
</style>
