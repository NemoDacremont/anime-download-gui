<template>
	<div class="anime-list-view">
		<header>
			<form @submit.prevent>
				<label for="search-filter">
					<input
						type="text"
						name="search-filter"
						id="search-filter"
						v-model="searchFilter"
						placeholder="Ex: One Piece"
					>
				</label>
			</form>

		</header>
			<!--div class="page-navigator">
				<page-navigation />
			</div-->


		<anime-list-component v-if="animeData">
			<li
				v-for="(anime, index) of animeDataFiltered"
				:key="index"
			>
				<anime-card :anime="anime" />
			</li>
		</anime-list-component>

		<footer>
			<div class="page-navigator">
				<page-navigation />
			</div>
		</footer>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';

import { animeListStore, constants } from '../store';
import PageNavigation from '../components/pageNavigation';


import { AnimeCard, AnimeList as AnimeListComponent } from '../components/animeList';
import { Anime } from '../../../server/src/stores/animes';

export default defineComponent({
	name: 'AnimeListView',
	components: {
		AnimeCard,
		AnimeListComponent,
		PageNavigation
	},
	data () {
		return {
			version: this.$route.params.version as 'vostfr' | 'vf',
			animeData: null as Anime[] | null,
			page: Array.isArray(this.$route.params.page) 
				?	-1
				:	parseInt( this.$route.params.page ),
			itemsPerPage: constants.state.ANIME_PER_PAGE,
			baseUrl: '/animelist/vostfr/{{newPage}}',
			route: useRoute(),
			searchFilter: ''
		}
	},
	computed: {
		animeDataFiltered (): Anime[]{
			const { itemsPerPage, animeData, page } = this.$data;

			if (!animeData) return [];

			if (
					!page ||
					page <= 0 ||
					page >= animeData.length / itemsPerPage
				) return [];

			return animeData.slice( itemsPerPage * (page - 1), itemsPerPage * page );
		}
	},
	async created () {
		// Handle truc nul
		const { page, version } = this.$data;
		const animeDataTemp = animeListStore.state[ version ];
		if (
			(page <= 0) ||
			(
				animeDataTemp &&
				page >= Math.floor(animeDataTemp.length / constants.state.ANIME_PER_PAGE) + 1
			)
		) {
			this.$router.push({
				name: '404'
			});
		}

		if (animeDataTemp) console.log(Math.floor(animeDataTemp.length / constants.state.ANIME_PER_PAGE) + 1);


		// 
		if (animeListStore.state[ version ]) this.$data.animeData = animeListStore.state[ version ];
		else {
			animeListStore.dispatch('loadData', version)
				.then(() => {
					this.$data.animeData = animeListStore.state[ version ];
				});
		}
	}
})
</script>

<style lang="scss" scoped>

header {
	padding: 2em 5em;
	display: flex;
	justify-content: space-between;
	align-items: center;

	form {
		input[type=text] {
			border-radius: 2em;
			padding: .5em 1em;
			font-size: 1em;
			border: .2em solid var(--highlight-activable);
			transition: border-color .25s, border-radius .25s;
			background-color: var(--font-color);
			width: 20em;

			&:focus {
				border-color: var(--highlight-active);
				border-radius: .5em;
			}
		}
	}
}

.anime-list-view {
	position: relative;
	overflow: auto;
	height: 100vh;
}

.page-navigator {
	display: flex;
	gap: 1rem;
}

</style>