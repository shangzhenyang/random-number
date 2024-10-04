<script setup lang="ts">
defineProps<{
	id: string;
	isCheckBox: boolean;
	labelValue: string;
	value: string | boolean;
	setValue: (event: Event) => void;
}>();
</script>

<template>
	<div
		:class="{
			'input-bar': true,
			'checkbox': isCheckBox,
		}"
	>
		<label :for="id">{{ labelValue }}</label>
		<div
			v-if="isCheckBox"
			class="spacer"
		></div>
		<input
			v-if="isCheckBox"
			:id="id"
			type="checkbox"
			:checked="Boolean(value)"
			@change="setValue"
		/>
		<input
			v-else
			:id="id"
			type="number"
			:value="value"
			@input="setValue"
		/>
	</div>
</template>

<style scoped>
.input-bar {
	align-items: center;
	display: flex;
	gap: 10px;
	justify-content: space-between;
}

.input-bar input[type="checkbox"] {
	--size: 20px;
	accent-color: var(--theme-color);
	height: var(--size);
	width: var(--size);
}

.input-bar input[type="number"] {
	background-color: var(--fg-alpha-1);
	border: none;
	border-radius: 5px;
	font-size: inherit;
	padding: 10px 15px;
	width: 70%;
}

.input-bar.checkbox {
	margin-top: 10px;
}

.spacer {
	border-bottom: 1px solid var(--fg-alpha-1);
	flex: 1;
}
</style>
