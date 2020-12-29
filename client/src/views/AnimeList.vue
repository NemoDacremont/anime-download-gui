<template>
	<div class="anime-list-view">
		<header>
			<form @submit.prevent="search">
				<label for="search-filter">
					<input
						type="text"
						name="search-filter"
						id="search-filter"
						v-model.trim="searchFilterRaw"
						maxlength="10"
						@input="search"
						placeholder="Ex: One Piece"
					>
				</label>

				<label for="submit">
					<span class="material-icons">
						search
					</span>
					<input
						type="submit"
						id="submit"
						name="submit"
					>
				</label>
			</form>

			<div class="display-style">
				<router-link
					class="clickable"
					:to="{
						name: 'AnimeList',
						params: {
							...$route.params,
							version: 'vostfr'
						}
					}"
				>
					<span :class="{ active: isVOSTFRSelected }" >
						vostfr
					</span>
				</router-link>
				
				<router-link
					class="clickable"
					:to="{
						name: 'AnimeList',
						params: {
							...$route.params,
							version: 'vf'
						}
					}"
				>
					<span :class="{ active: !isVOSTFRSelected }">
						vf
					</span>
				</router-link>

				<hr>

				<span
					class="material-icons clickable"
					:class="{ active: isGridViewSelected }"
					@click="selectGridView"
				>view_module</span>

				<span
					class="material-icons clickable"
					:class="{ active: !isGridViewSelected}"
					@click="selectListView"
				>list</span>
			</div>

		</header>
			<!--div class="page-navigator">
				<page-navigation />
			</div-->


		<anime-list-component
			v-if="getAnimeList(version)"
			:class=" isGridViewSelected ? 'grid': 'list'"
		>
			<!--li
				v-for="(anime, index) of animeDataFiltered"
				:key="index"
			>
				<anime-card
					:anime="anime"
					:class=" isGridViewSelected ? 'grid': 'list'"
				/>
			</li-->
		</anime-list-component>

		<footer>
			<div class="page-navigator">
				<page-navigation />
			</div>
		</footer>
	</div>
</template>

<script lang="ts">
// Modules
import { defineComponent } from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';

// Import required to use this.$route
// eslint-disable-next-line
import { useRoute } from 'vue-router';

// Types
import { Version } from '../store/animeList';

// Components
import PageNavigation from '../components/pageNavigation';
import { /*AnimeCard*/ AnimeList as AnimeListComponent } from '../components/animeList';

// Constants data
import { ANIME_PER_PAGE } from '../constants';

export default defineComponent({
	name: 'AnimeListView',
	components: {
		//AnimeCard,
		AnimeListComponent,
		PageNavigation
	},
	data () {
		return {
			version: this.$route.params.version as Version,
			baseUrl: '/animelist/vostfr/{{newPage}}',
			searchFilterRaw: this.$route.query.search
		}
	},
	computed: {
		page (): number {
			const { page } = this.$route.params;

			return Array.isArray( page ) 
				?	-1
				:	parseInt( page );
		},
		isVOSTFRSelected (): boolean {
			return this.$route.params.version === 'vostfr';
		},
		...mapGetters(['isGridViewSelected', 'getAnimeList', 'animeListFilteredLength'])
	},
	methods: {
		selectGridView () {
			if (!this.isGridViewSelected) this.setAnimeListView('grid');
		},
		selectListView () {
			if (this.isGridViewSelected) this.setAnimeListView('list');
		},
		search () {
			const { version } = this.$route.params;
			const { searchFilterRaw } = this.$data;

			this.$router.push({
				name: 'AnimeList',
				params: {
					version,
					page: 1
				},
				query: {
					search: searchFilterRaw
				}
			});
		},
		...mapMutations(['setAnimeListView']),
		...mapActions(['loadData'])
	},
	async created () {
		/*
		*		Redirect to 404 page if the page passed in param is invalid
		*/
		const { page } = this;
		const { version } = this.$data;
		const { search } = this.$route.query;
		const animeDataLength = this.animeListFilteredLength(version, search);
		if (
			page < 1 ||
			page > Math.floor(animeDataLength / ANIME_PER_PAGE) + 1
		) {
			// Using .replace because it allows go back
			this.$router.replace({
				name: '404'
			});
		}

		/*
		*		Cache animeList if it isn't already
		*/
		if (!this.getAnimeList(version)) this.loadData(version);
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
		display: flex;
		align-items: center;

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

		label[for=submit] {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			font-size: 2em;
			padding: .5em;
			color: var(--font-color);
			transition: color .25s;

			&:hover {
				cursor: pointer;
				color: var(--highlight-activable);
			}

			input[type=submit] {
				display: none;
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
	gap: 2em;
	position: relative;

	hr {
		border: 0;
		height: 1.5em;
		border-left: .1em solid var(--font-color);
	}

	/*span {
		/*
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
	}*/
}
</style>