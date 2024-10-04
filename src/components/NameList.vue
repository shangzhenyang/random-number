<script setup lang="ts">
import NewName from "@/components/NewName.vue";
import TitleBar from "@/components/TitleBar.vue";
import i18next from "i18next";
import { ref } from "vue";

const props = defineProps<{
	names: string[];
	setNames: (newValue: string[]) => void;
}>();

const description = ref<string>(i18next.t("importNamesDescription"));
const editingIndex = ref<number>(-1);

function deleteName(index: number): void {
	const newNames = [...props.names];
	newNames.splice(index, 1);
	props.setNames(newNames);
}

function exportNames(): void {
	const newA = document.createElement("a");
	newA.href = URL.createObjectURL(
		new Blob([props.names.join("\n")], {
			type: "text/plain",
		}),
	);
	newA.download = "names.txt";
	newA.click();
}

function importNames(): void {
	const newInput = document.createElement("input");
	newInput.type = "file";
	newInput.accept = ".txt";
	newInput.onchange = (): void => {
		if (newInput.files && newInput.files.length > 0) {
			const file = newInput.files[0];
			const reader = new FileReader();
			reader.onload = (): void => {
				if (typeof reader.result === "string") {
					const newNames = reader.result
						.split("\n")
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
			:icons="[
				{
					icon: ['fas', 'download'],
					title: $t('import'),
					show: true,
					onClick: importNames,
				},
				{
					icon: ['fas', 'upload'],
					title: $t('export'),
					show: true,
					onClick: exportNames,
				},
			]"
			icon-size="lg"
		>
			<h2>{{ $t("names") }}</h2>
		</TitleBar>
		<div class="description">{{ description }}</div>
		<ul>
			<NewName
				:names="names"
				:set-names="setNames"
			/>
			<template
				v-for="(name, index) in names"
				:key="index"
			>
				<template v-if="editingIndex !== index">
					<li>
						<div class="list-item-main">{{ name }}</div>
						<button
							type="button"
							@click="() => (editingIndex = index)"
						>
							{{ $t("edit") }}
						</button>
						<button
							type="button"
							@click="() => deleteName(index)"
						>
							{{ $t("delete") }}
						</button>
					</li>
				</template>
				<template v-else>
					<NewName
						:names="names"
						:set-names="setNames"
						:index="index"
						:done-editing="() => (editingIndex = -1)"
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
	margin-bottom: 15px;
	opacity: 0.8;
}

.title-bar {
	margin: 15px 0 10px;
}
</style>
