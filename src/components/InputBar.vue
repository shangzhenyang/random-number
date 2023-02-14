<script setup lang="ts">

defineProps<{
	id: string;
	labelValue: string;
	type: string;
	value: string;
	setValue: (evt: Event) => void;
}>();
</script>

<template>
	<div class="input-bar">
		<label v-bind:for="id">{{ labelValue }}</label>
		<input
			v-bind:id="id"
			v-bind:type="type"
			v-bind:value="value"
			v-on:input="setValue"
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

.input-bar input {
	background-color: rgba(0, 0, 0, .1);
	border: none;
	border-radius: 5px;
	font-size: inherit;
	padding: 10px 15px;
	width: 70%;
}

@media (prefers-color-scheme: dark) {
	.input-bar input {
		background-color: rgba(255, 255, 255, .1);
	}
}
</style>
