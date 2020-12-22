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
				page: this.$route.params.page,
				version: this.$route.params.version
		}
	},
	methods: {
		go (): void {
			const { version, page } = this.$data;

			this.$router.push({
				name: '',
				params: {
					version,
					page
				}
			});
		}
	},
	computed: {
		maxPage (): number {
			const { version } = this.$data;
			if (Array.isArray(version)) return 0;
			return Math.floor(this.animeListLength( version ) / ANIME_PER_PAGE);
		},
		...mapGetters(['animeListLength'])
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