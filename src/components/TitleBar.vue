<script setup lang="ts">
import IconBar from "@/components/IconBar.vue";
import { IconInfo } from "@/types";

defineProps<{
	icons: IconInfo[];
	iconSize: string;
}>();
</script>

<template>
	<div class="title-bar">
		<slot></slot>
		<IconBar
			:items="icons"
			:size="iconSize"
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
