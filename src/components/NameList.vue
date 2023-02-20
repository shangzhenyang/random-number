<script setup lang="ts">
import { ref } from "vue";
import i18next from "i18next";

import NewName from "@/components/NewName.vue";
import TitleBar from "@/components/TitleBar.vue";

const props = defineProps<{
	names: string[];
	setNames: (newValue: string[]) => void;
}>();

const description = ref(i18next.t("importNamesDescription"));
const editingIndex = ref(-1);

function deleteName(index: number) {
	const newNames = [...props.names];
	newNames.splice(index, 1);
	props.setNames(newNames);
}

function exportNames() {
	const newA = document.createElement("a");
	newA.href = URL.createObjectURL(new Blob([
		props.names.join("\n")
	], {
		type: "text/plain"
	}));
	newA.download = "names.txt";
	newA.click();
}

function importNames() {
	const newInput = document.createElement("input");
	newInput.type = "file";
	newInput.accept = ".txt";
	newInput.onchange = () => {
		if (newInput.files && newInput.files.length > 0) {
			const file = newInput.files[0];
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === "string") {
					const newNames = reader.result.split("\n")
						.filter((nameItem) => {
							return !!nameItem;
						})
						.map((nameItem) => {
							return nameItem.trim();
						});
					props.setNames(newNames);
				}
			};
			reader.readAsText(file);
		}
	};
	newInput.click();
}
</script>

<template>
	<section>
		<TitleBar
			v-bind:icons="[{
				icon: ['fas', 'download'],
				title: $t('import'),
				show: true,
				onClick: importNames
			}, {
				icon: ['fas', 'upload'],
				title: $t('export'),
				show: true,
				onClick: exportNames
			}]"
			icon-size="lg"
		>
			<h2>{{ $t("names") }}</h2>
		</TitleBar>
		<div class="description">{{ description }}</div>
		<ul>
			<NewName
				v-bind:names="names"
				v-bind:set-names="setNames"
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
						v-bind:set-names="setNames"
						v-bind:index="index"
						v-bind:done-editing="() => editingIndex = -1"
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

.description {
	font-size: 14px;
	opacity: .8;
}

.title-bar {
	margin: 15px 0 10px;
}
</style>
