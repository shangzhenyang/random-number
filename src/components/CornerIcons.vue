<script setup lang="ts">
import type CornerIconInfo from "@/types/CornerIconInfo";

defineProps<{
	items: CornerIconInfo[];
}>();
</script>

<template>
	<div class="corner-icons">
		<font-awesome-icon
			v-for="item in items"
			v-bind:key="item"
			v-bind:icon="item.icon"
			size="xl"
			v-bind:title="item.title"
			class="corner-icon"
			role="button"
			tabindex="0"
			v-on:click="item.onClick"
		/>
	</div>
</template>

<style scoped>
.corner-icons {
	bottom: 20px;
	cursor: pointer;
	display: flex;
	gap: 20px;
	position: fixed;
	right: 20px;
}

.corner-icon {
	transition: transform .25s;
}

.corner-icon:hover {
	transform: rotate(360deg);
}

.corner-icon:active {
	transform: scale(0.9);
}
</style>
