<script setup lang="ts">
import { ref } from "vue";

import NewName from "@/components/NewName.vue";

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
		<h2>{{ $t("names") }}</h2>
		<ul>
			<NewName
				v-bind:names="names"
				v-bind:setNames="setNames" />
			<template
				v-for="(name, index) in names"
				v-bind:key="index">
				<template v-if="editingIndex !== index">
					<li>
						<div class="list-item-main">{{ name }}</div>
						<button
							v-on:click="_ => editingIndex = index">
							{{ $t("edit") }}
						</button>
						<button
							v-on:click="deleteName(index)">
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
