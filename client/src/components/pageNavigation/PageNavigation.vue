<template>
	<div class="page-navigation">
		<page-incrementor version="previous" :baseUrl="baseUrl" :currentPage="currentPage" />

		

		<page-incrementor version="next" :baseUrl="baseUrl" :currentPage="currentPage" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router';
import PageIncrementor from './PageIncrementor.vue';

export default defineComponent({
	props: {
		baseUrl: {
			type: String,
			validator: (value: string) => value.includes('{{newPage}}')
		},
		currentPage: {
			type: Number
		}
	},
	components: {
		PageIncrementor
	},
	mounted () {
		useRoute();
	}
})
</script>

<style lang="scss" scoped>

</style>