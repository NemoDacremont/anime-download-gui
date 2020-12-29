<template>
	<div class="anime-list">
		<ol class="anime-list__list">
			<li
				v-for="(anime) of getAnimeListFiltered(version, page, searchFilter)"
				:key="anime.id"
			>
				<anime-card
					:anime="anime"
					:class=" isGridViewSelected ? 'grid': 'list'"
				/>
			</li>
		</ol>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Import required to use this.$route
// eslint-disable-next-line
import { useRoute } from 'vue-router';

// Component
import animeCard from './AnimeCard.vue';

// Store
import { mapGetters } from 'vuex';

export default defineComponent({
	name: 'AnimeList',
	components: {
		animeCard
	},
	data () {
		return {
			version: this.$route.params.version,
			page: this.$route.params.page,
			searchFilter: this.$route.query.search
		}
	},
	computed: {
		...mapGetters(['getAnimeList', 'isGridViewSelected', 'getAnimeListFiltered'])
	}
});
</script>

<style lang="scss" scoped>

.anime-list {

	&.list {
		.anime-list__list {
			display: flex;
			flex-direction: column;
			gap: 1em;
		}
	}

	&.grid {
		.anime-list__list {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			grid-auto-rows: auto;
			gap: 1em;
		}
	}
		
	.anime-list__list {

		position: relative;

		list-style: none;

		padding: 1em;
	}
}

</style>