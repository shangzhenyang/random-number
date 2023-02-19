<script setup lang="ts">
import { ref } from "vue";

import type SettingsInfo from "@/types/SettingsInfo";

const props = defineProps<{
	settings: SettingsInfo;
	addHistoryItem: (item: string) => void;
}>();

const isScrolling = ref(false);
const number = ref(0);

function getRandInt(min: number, max: number): number {
	return Math.floor((Math.random() * (max - min + 1)) + min);
}

function startScrolling() {
	// use setTimeout instead of setInterval to dynamically change the speed
	window.setTimeout(() => {
		number.value = getRandInt(
			parseInt(props.settings.minimum),
			parseInt(props.settings.maximum)
		);
		if (isScrolling.value) {
			startScrolling();
		}
	}, 1000 / parseInt(props.settings.speed));
}

function toggleScrolling() {
	if (isScrolling.value) {
		props.addHistoryItem(number.value.toString());
	} else {
		startScrolling();
	}
	isScrolling.value = !isScrolling.value;
}
</script>

<template>
	<div class="number-area">
		<div class="number-box">{{ number }}</div>
		<button
			class="main-btn"
			v-on:click="toggleScrolling"
		>
			{{ isScrolling ? $t("stop") : $t("start") }}
		</button>
	</div>
</template>

<style scoped>
.main-btn {
	background-color: var(--theme-color);
	border: 1px solid rgba(0, 0, 0, .2);
	border-radius: 5px;
	color: white;
	font-size: 24px;
	padding: 10px 30px;
	text-transform: uppercase;
	transition: filter .25s;
	width: 300px;
}

.main-btn:focus {
	filter: brightness(1.1);
}

.main-btn:hover {
	filter: brightness(1.2);
}

.main-btn:active {
	filter: brightness(.9);
}

.number-area {
	align-items: center;
	display: flex;
	flex-direction: column;
	gap: 20px;
	justify-content: center;
}

.number-box {
	border: 1px solid rgba(0, 0, 0, .2);
	border-radius: 5px;
	font-size: 64px;
	overflow: auto;
	padding: 20px;
	text-align: center;
	width: 300px;
}

@media (prefers-color-scheme: dark) {

	.main-btn,
	.number-box {
		border-color: rgba(255, 255, 255, .2);
	}
}
</style>
