<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
	names: string[];
	setNames: (newValue: string[]) => void;
	index?: number;
	doneEditing?: () => void;
}>();

const newName = ref<string>(
	props.index !== undefined ? props.names[props.index] : "",
);

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
		<input
			id="new-name"
			class="list-item-main"
			type="text"
			v-model="newName"
			:placeholder="$t('enterHere').toString()"
			@keydown.enter="saveName"
		/>
		<button
			:disabled="!newName"
			type="button"
			@click="saveName"
		>
			{{ $t("save") }}
		</button>
		<button
			v-if="index"
			:disabled="!newName"
			type="button"
			@click="doneEditing"
		>
			{{ $t("cancel") }}
		</button>
	</li>
</template>

<style scoped>
.list-input-bar input {
	background-color: transparent;
	border-radius: 0;
	transition: background-color 0.25s;
}

.list-input-bar input:focus {
	background-color: var(--fg-alpha-1);
}

.list-input-bar input::placeholder {
	color: var(--fg-alpha-5);
}
</style>
