<script setup lang="ts">

defineProps<{
	id: string;
	isCheckBox: boolean;
	labelValue: string;
	value: string | boolean;
	setValue: (evt: Event) => void;
}>();
</script>

<template>
	<div v-bind:class="{
		'input-bar': true,
		'checkbox': isCheckBox
	}">
		<label v-bind:for="id">{{ labelValue }}</label>
		<div v-if="isCheckBox" class="spacer"></div>
		<input
			v-if="isCheckBox"
			v-bind:id="id"
			type="checkbox"
			v-bind:checked="Boolean(value)"
			v-on:change="setValue"
		/>
		<input
			v-else
			v-bind:id="id"
			type="number"
			v-bind:value="value"
			v-on:input="setValue"
		/>
	</div>
</template>

<style scoped>
.checkbox {
	margin-top: 10px;
}

.input-bar {
	align-items: center;
	display: flex;
	gap: 10px;
	justify-content: space-between;
}

.input-bar input[type=checkbox] {
	--size: 20px;
	accent-color: var(--theme-color);
	height: var(--size);
	width: var(--size);
}

.input-bar input[type=number] {
	background-color: rgba(0, 0, 0, .1);
	border: none;
	border-radius: 5px;
	font-size: inherit;
	padding: 10px 15px;
	width: 70%;
}

.spacer {
	border-bottom: 1px solid rgba(0, 0, 0, .1);
	flex: 1;
}

@media (prefers-color-scheme: dark) {
	.input-bar input[type=number] {
		background-color: rgba(255, 255, 255, .1);
	}

	.spacer {
		border-bottom: 1px solid rgba(255, 255, 255, .1);
	}
}
</style>
