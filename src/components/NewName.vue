<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
	names: string[];
	setNames: (newValue: string[]) => void;
	index?: number;
	doneEditing?: () => void;
}>();

const newName = ref(props.index ? props.names[props.index] : "");

function saveName() {
	if (newName.value) {
		if (props.index) {
			const newNames = [...props.names];
			newNames[props.index] = newName.value;
			props.setNames(newNames);
			props.doneEditing?.();
		} else {
			props.setNames([...props.names, newName.value]);
		}
		newName.value = "";
	}
}
</script>

<template>
	<li class="input-bar">
		<label for="new-name">{{ $t("newName") }}</label>
		<input
			id="new-name"
			class="list-item-main"
			type="text"
			v-model="newName"
			v-bind:placeholder="$t('enterHere').toString()"
			v-on:keydown.enter="saveName"
		/>
		<button
			v-bind:disabled="!newName"
			v-on:click="saveName">
			{{ $t("save") }}
		</button>
		<button
			v-if="index"
			v-bind:disabled="!newName"
			v-on:click="doneEditing">
			{{ $t("cancel") }}
		</button>
	</li>
</template>

<style scoped>
.input-bar input {
	background-color: transparent;
	transition: background-color .25s;
}

.input-bar input:focus {
	background-color: rgba(0, 0, 0, .1);
}

.input-bar input::placeholder {
	color: rgba(0, 0, 0, .5);
}

@media (prefers-color-scheme: dark) {
	li.input-bar input:focus {
		background-color: rgba(255, 255, 255, .1);
	}

	li.input-bar input::placeholder {
		color: rgba(255, 255, 255, .5);
	}
}
</style>
