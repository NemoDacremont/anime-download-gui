<template>
	<div class="page-navigation">
		<page-incrementor variant="previous" v-show="showPrevious" />

		<go-to-page-form />

		<page-incrementor variant="next" v-show="showNext" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex';

import PageIncrementor from './PageIncrementor.vue';
import GoToPageForm from './GoToPageForm.vue';

// Constants
import { ANIME_PER_PAGE } from '../../constants'

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
			const { version } = this.$route.params;
			const { search } = this.$route.query;
			const animeListLength = this.animeListFilteredLength(version, search);

			const page = parseInt(this.$route.params.page as string);
			const totalPages = Math.floor(animeListLength / ANIME_PER_PAGE);

			return page <= totalPages - 1;
		},
		...mapGetters(['animeListFilteredLength'])
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
