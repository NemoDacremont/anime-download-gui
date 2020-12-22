<template>
	<form @submit.prevent="go" class="go-to-page-form">
		<label for="pageInput">
			<input
				type="number"
				name="pageInput"
				id="pageInput"
				v-model="page"
				length="2" 
				min="1"
				:max="maxPage"
			>
		</label>
		<input type="submit" value="Go">
	</form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// Stores
import { mapGetters } from 'vuex';

// Constants
import { ANIME_PER_PAGE } from '../../constants';

export default defineComponent({
	name: 'GoToPageForm',
	data () {
		return {
				page: this.$route.params.page
		}
	},
	methods: {
		go (): void {
			const { query } = this.$route;
			const { version } = this.$route.params;
			const { page } = this.$data;

			this.$router.push({
				name: '',
				params: {
					version,
					page
				},
				query
			});
		}
	},
	computed: {
		maxPage (): number {
			const { version } = this.$route.params;
			const { search } = this.$route.query;

			if (Array.isArray(version)) return 0;
			return Math.floor(this.animeListFilteredLength( version, search ) / ANIME_PER_PAGE);
		},
		...mapGetters(['animeListFilteredLength'])
	}
})
</script>

<style lang="scss">

.go-to-page-form {
	display: flex;
	gap: .5em;

	input[type=number] {
		width: 5em;
		padding: .25em .5em;
		
	}
}

</style>