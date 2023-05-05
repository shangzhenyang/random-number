<script setup lang="ts">
import IconBar from "@/components/IconBar.vue";

import type IconInfo from "@/types/IconInfo";

defineProps<{
	icons: IconInfo[];
	iconSize: string;
}>();
</script>

<template>
	<div class="title-bar">
		<slot></slot>
		<IconBar
			v-bind:items="icons"
			v-bind:size="iconSize"
		/>
	</div>
</template>

<style scoped>
.title-bar {
	align-items: center;
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
	padding-right: 5px;
}
</style>
