<template>
	<div class="page-navigation">
		<page-incrementor variant="previous" v-show="showPrevious" />

		<go-to-page-form />

		<page-incrementor variant="next" v-show="showNext" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import PageIncrementor from './PageIncrementor.vue';
import GoToPageForm from './GoToPageForm.vue';

import { animeListStore, constants } from '../../store';

export default defineComponent({
	components: {
		PageIncrementor,
		GoToPageForm
	},
	data () {
		return {
			version: this.$route.params.version as 'vostfr' | 'vf',
			page: this.$route.params.page as string,
		}
	},
	computed: {
		showPrevious (): boolean {
			const page = parseInt(this.$data.page);
			return page > 1;
		},
		showNext (): boolean {
			const { version } = this.$data;
			const animeList = animeListStore.state[version];

			if (animeList === null) return false;

			const totalPages = Math.floor(animeList.length / constants.state.ANIME_PER_PAGE);
			const page = parseInt(this.$data.page);

			return page <= totalPages - 1;
		}
	}
})
</script>

<style lang="scss" scoped>

.page-navigation {
	width: 100%;

	padding: 1em;

	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1em;
}

</style>