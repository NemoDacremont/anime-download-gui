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

			<div class="display-style">
				<span
					class="material-icons"
					:class="{ active: isGridViewSelected }"
					@click="selectGridView"
				>view_module</span>

				<span
					class="material-icons"
					:class="{ active: !isGridViewSelected}"
					@click="selectListView"
				>list</span>
			</div>

		</header>
			<!--div class="page-navigator">
				<page-navigation />
			</div-->


		<anime-list-component
			v-if="animeData"
			:variant=" isGridViewSelected ? 'grid': 'list'"
		>
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
			searchFilter: '',
			isGridViewSelected: true
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
	methods: {
		selectGridView () {
			this.$data.isGridViewSelected = true;
		},
		selectListView () {
			this.$data.isGridViewSelected = false;
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
	padding: 1em 3em;
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

.display-style {
	display: flex;
	align-items: center;
	padding: 0;
	gap: 3em;

	span {
		position: relative;
		color: var(--font-color);
		transition: color .25s;
		width: 3em;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;

		&::selection {
			background-color: transparent;
		}

		&.active {
			color: var(--highlight-active);
		}

		&::before {
			content: '';
			width: 100%;
			height: 100%;

			position: absolute;
			left: 0;
			top: 0;

			background-color: var(--background-color-highlight);
			border-radius: 50%;

			opacity: 0;
			z-index: -1;
			transform: scale(50%, 50%);
			transition: opacity .25s, transform .25s;
		}

		&:hover {
			cursor: pointer;
			color: var(--highlight-activable);
			&.active {
				color: var(--highlight-active);
			}

			&::before {
				opacity: 50%;
				transform: scale(100%, 100%);
			}
		}
	}
}

</style>