<template>
	<div class="anime-list-view">
		<header>
			<h1>AnimeList</h1>
			<div class="page-navigator">
				<page-navigation />
			</div>
		</header>


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
import axios from 'axios';

import { animeListStore } from '../store';
import PageNavigation from '../components/pageNavigation';


import { AnimeCard, AnimeList as AnimeListComponent } from '../components/animeList';

export default defineComponent({
	name: 'AnimeListView',
	components: {
		AnimeCard,
		AnimeListComponent,
		PageNavigation
	},
	data (): {
		version: 'vostfr' | 'vf';
		animeData: object[] | null;
		itemsPerPage: number;
		page: number;
		baseUrl: string;
		route: RouteLocationNormalizedLoaded;
	} {
		return {
			version: this.$route.params.version as 'vostfr' | 'vf',
			animeData: null,
			page: Array.isArray(this.$route.params.page) 
				?	-1
				:	parseInt( this.$route.params.page ),
			itemsPerPage: 50,
			baseUrl: '/animelist/vostfr/{{newPage}}',
			route: useRoute()
		}
	},
	computed: {
		animeDataFiltered (): object[]{
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
		const { page } = this.$data;
		if (page <= 0) {
			this.$router.push({
				name: '404'
			});
		}


		// 
		const { version } = this.$data;

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
	padding: 1em 2em;
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