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
	backdrop-filter: blur(10px);
	bottom: 0;
	left: 0;
	padding: 20px;
	position: fixed;
	z-index: 2;
}
</style>
