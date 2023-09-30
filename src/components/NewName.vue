<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
	names: string[];
	setNames: (newValue: string[]) => void;
	index?: number;
	doneEditing?: () => void;
}>();

const newName = ref<string>(props.index !== undefined ?
	props.names[props.index] : "");

function saveName(): void {
	if (newName.value) {
		if (props.index !== undefined) {
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
	<li class="list-input-bar">
		<label for="new-name">{{ $t("newName") }}</label>
		<input id="new-name" class="list-item-main" type="text" v-model="newName" v-bind:placeholder="$t('enterHere').toString()" v-on:keydown.enter="saveName" />
		<button v-bind:disabled="!newName" v-on:click="saveName">
			{{ $t("save") }}
		</button>
		<button v-if="index" v-bind:disabled="!newName" v-on:click="doneEditing">
			{{ $t("cancel") }}
		</button>
	</li>
</template>

<style scoped>
.list-input-bar input {
	background-color: transparent;
	border-radius: 0;
	transition: background-color .25s;
}

.list-input-bar input:focus {
	background-color: var(--fg-alpha-1);
}

.list-input-bar input::placeholder {
	color: var(--fg-alpha-5);
}
</style>
