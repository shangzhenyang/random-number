<script setup lang="ts">
import { SettingsInfo } from "@/types";
import { ref } from "vue";

const props = defineProps<{
	historyItems: string[];
	names: string[];
	settings: SettingsInfo;
	addHistoryItem: (item: string) => void;
	setSettings: (newValue: SettingsInfo) => void;
}>();

const isScrolling = ref<boolean>(false);
const number = ref<string>("0"); // string for names

let timeoutId: number | undefined = undefined;

function getRandomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomValue(): string {
	const min = parseInt(props.settings.minimum);
	const max = parseInt(props.settings.maximum);
	if (isNaN(min) || isNaN(max)) {
		// Easter egg
		// returns a random Chinese character
		return String.fromCharCode(getRandomInt(19968, 40868));
	}
	const randomInt = getRandomInt(min, max);
	let result = randomInt.toString();
	if (
		(props.settings.oddOnly && randomInt % 2 === 0) ||
		(props.settings.evenOnly && randomInt % 2 !== 0)
	) {
		return getRandomValue();
	}
	if (props.names.length > 0) {
		const nameValue = props.names[randomInt - 1];
		if (nameValue) {
			result = nameValue;
		}
	}
	if (!props.settings.repeat) {
		let total = max - min + 1;
		if (props.settings.oddOnly) {
			total = Math.floor(total / 2);
		} else if (props.settings.evenOnly) {
			total = Math.ceil(total / 2);
		}
		if (total - props.historyItems.length <= 1) {
			const newSettings = { ...props.settings };
			newSettings.repeat = true;
			props.setSettings(newSettings);
			isScrolling.value = false;
			stopScrolling();
			return "0";
		}
		if (props.historyItems.includes(result)) {
			return getRandomValue();
		}
	}
	return result;
}

function startScrolling(): void {
	// uses setTimeout instead of setInterval to dynamically change the speed
	timeoutId = window.setTimeout(
		() => {
			try {
				const randomValue = getRandomValue();
				number.value = randomValue;
				if (isScrolling.value) {
					startScrolling();
				}
			} catch (error) {
				console.error(error);
				localStorage.clear();
				window.location.reload();
			}
		},
		1000 / parseInt(props.settings.speed),
	);
}

function stopScrolling(): void {
	clearTimeout(timeoutId);
}

function toggleScrolling(): void {
	if (isScrolling.value) {
		stopScrolling();
		const randomValue = getRandomValue();
		number.value = randomValue;
		props.addHistoryItem(randomValue);
	} else {
		startScrolling();
	}
	isScrolling.value = !isScrolling.value;
}
</script>

<template>
	<div class="number-area">
		<div
			:class="{
				'number-box': true,
				'name': props.names.length > 0,
			}"
		>
			{{ number }}
		</div>
		<button
			class="main-btn"
			type="button"
			@click="toggleScrolling"
		>
			{{ isScrolling ? $t("stop") : $t("start") }}
		</button>
	</div>
</template>

<style scoped>
.main-btn {
	background-color: var(--theme-color);
	border: 1px solid var(--fg-alpha-2);
	border-radius: 5px;
	color: white;
	font-size: 24px;
	padding: 10px 30px;
	text-transform: uppercase;
	transition: filter 0.25s;
	width: 300px;
}

.main-btn:focus {
	filter: brightness(1.1);
}

.main-btn:hover {
	filter: brightness(1.2);
}

.main-btn:active {
	filter: brightness(0.9);
}

.number-area {
	align-items: center;
	display: flex;
	flex-direction: column;
	gap: 20px;
	justify-content: center;
}

.number-box {
	align-items: center;
	border: 1px solid var(--fg-alpha-2);
	border-radius: 5px;
	display: flex;
	font-size: 64px;
	height: 135px;
	justify-content: center;
	overflow: hidden;
	text-align: center;
	width: 300px;
}

.number-box.name {
	font-size: 40px;
}
</style>
