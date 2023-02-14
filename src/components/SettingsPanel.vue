<script setup lang="ts">
defineProps<{
	show: boolean;
}>();
</script>

<template>
	<aside v-if="show">
		<h1>{{ $t("settings") }}</h1>
	</aside>
</template>

<style scoped>
aside {
	border-left: 1px solid rgba(0, 0, 0, .2);
	height: 100%;
	padding: 20px;
	width: 500px;
}

h1 {
	font-size: 24px;
	font-weight: normal;
	margin: 0;
}

@media (prefers-color-scheme: dark) {
	aside {
		border-left-color: rgba(255, 255, 255, .2);
	}
}
</style>
