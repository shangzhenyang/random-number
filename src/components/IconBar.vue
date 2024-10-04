<script setup lang="ts">
import { IconInfo } from "@/types";
import { computed } from "vue";

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
			:key="item.title"
			:icon="item.icon"
			:size="size"
			:title="item.title"
			class="icon"
			role="button"
			tabindex="0"
			@click="() => item.onClick()"
			@keydown.enter="() => item.onClick()"
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
	transition: all 0.25s;
}

.icon:focus,
.icon:hover {
	opacity: 0.8;
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
