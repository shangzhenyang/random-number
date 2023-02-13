<script setup lang="ts">
import CornerIcons from "@/components/CornerIcons.vue";
import FooterArea from "@/components/FooterArea.vue";
import NumberArea from "@/components/NumberArea.vue";

function openGitHub() {
	window.open("https://github.com/shangzhenyang/random-number");
}
</script>

<template>
	<div class="app">
		<main>
			<NumberArea />
			<FooterArea />
			<CornerIcons v-bind:items="[{
				icon: ['fab', 'github'],
				title: 'GitHub',
				onClick: openGitHub
			}, {
				icon: ['fas', 'gear'],
				title: $t('settings'),
				onClick: () => { }
			}]" />
		</main>
		<aside>

		</aside>
	</div>
</template>
