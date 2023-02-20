<script setup lang="ts">
import { computed } from "vue";

import type IconInfo from "@/types/IconInfo";

const props = defineProps<{
	items: IconInfo[];
	size: string;
}>();

const itemsShowing = computed(() => {
	return props.items.filter((item) => {
		return item.show;
	});
});
</script>

<template>
	<div class="icon-bar">
		<font-awesome-icon
			v-for="item in itemsShowing"
			v-bind:key="item.title"
			v-bind:icon="item.icon"
			v-bind:size="size"
			v-bind:title="item.title"
			class="icon"
			role="button"
			tabindex="0"
			v-on:click="() => item.onClick()"
		/>
	</div>
</template>

<style scoped>
.icon-bar {
	display: flex;
	gap: 20px;
}

.icon {
	cursor: pointer;
	transition: all .25s;
}

.icon:focus,
.icon:hover {
	opacity: .8;
	transform: rotate(-360deg);
}

.icon:active {
	transform: scale(0.9);
}

@media screen and (max-width: 800px) {
	.icon-bar {
		gap: 30px;
	}
}
</style>
