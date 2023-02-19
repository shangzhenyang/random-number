<script setup lang="ts">
import { ref } from "vue";

import NewName from "@/components/NewName.vue";
import TitleBar from "@/components/TitleBar.vue";

const props = defineProps<{
	names: string[];
	setNames: (newValue: string[]) => void;
}>();

const editingIndex = ref(-1);

function deleteName(index: number) {
	const newNames = [...props.names];
	newNames.splice(index, 1);
	props.setNames(newNames);
}
</script>

<template>
	<section>
		<TitleBar
			v-bind:icons="[{
				icon: ['fas', 'download'],
				title: $t('import'),
				show: true,
				onClick: () => { }
			}, {
				icon: ['fas', 'upload'],
				title: $t('export'),
				show: true,
				onClick: () => { }
			}]"
			iconSize="lg"
		>
			<h2>{{ $t("names") }}</h2>
		</TitleBar>
		<ul>
			<NewName
				v-bind:names="names"
				v-bind:setNames="setNames"
			/>
			<template
				v-for="(name, index) in names"
				v-bind:key="index">
				<template v-if="editingIndex !== index">
					<li>
						<div class="list-item-main">{{ name }}</div>
						<button v-on:click="() => editingIndex = index">
							{{ $t("edit") }}
						</button>
						<button v-on:click="() => deleteName(index)">
							{{ $t("delete") }}
						</button>
					</li>
				</template>
				<template v-else>
					<NewName
						v-bind:names="names"
						v-bind:setNames="setNames"
						v-bind:index="index"
						v-bind:doneEditing="() => editingIndex = -1"
					/>
				</template>
			</template>
		</ul>
	</section>
</template>

<style scoped>
h2 {
	font-size: 20px;
	font-weight: normal;
	margin: 0;
}

.title-bar {
	margin-top: 10px;
}
</style>
