<template>
	<footer>
		&copy; {{ new Date().getFullYear() }} <a href="https://www.shangzhenyang.com/">{{ $t("shangzhenYang") }}</a>
	</footer>
</template>

<style scoped>
a {
	color: inherit;
}

footer {
	bottom: 20px;
	left: 20px;
	position: fixed;
}
</style>
