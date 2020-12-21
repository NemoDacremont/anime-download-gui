<template>
	<div class="anime-list-view">
		<div class="top-bar">
			
		</div>
		<anime-list-component v-if="animeData">
			<li
				v-for="(anime, index) of animeDataFiltered"
				:key="index"
			>
				<anime-card :anime="anime" />
			</li>
		</anime-list-component>

		<div class="page-navigator">
			<page-navigation :baseUrl="baseUrl" :currentPage="page"/>
		</div>
		
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import { constants } from '../store';
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
		version: string | string[];
		animeData: object[] | null;
		itemsPerPage: number;
		page: number;
		baseUrl: string;
		//route: RouteLocationNormalizedLoaded;
	} {
		return {
			//route: useRoute(),
			version: this.$route.params.version,
			animeData: null,
			page: Array.isArray(this.$route.params.page) 
				?	-1
				:	parseInt( this.$route.params.page ),
			itemsPerPage: 50,
			baseUrl: '/animelist/vostfr/{{newPage}}'
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
	methods: {
		go () {
			this.$router.go(0);
		}
	},
	async created () {
		const route = useRoute();
		console.log(route);
		this.$data.animeData = (await axios.get( `${constants.state.API_BASE_URL}/animes/animelist/${this.$data.version}` )).data;
	}
})
</script>

<style lang="scss" scoped>

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