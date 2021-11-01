
import { useRouter } from 'vue-router';
import { GetterTree } from 'vuex';
import { AnimeListState as State } from './animeListState';
import { Version, Anime } from './animeListTypes';
import { ANIME_PER_PAGE } from '@/constants';

export interface Getters {
	getAnimeList (state: State): (version: Version) => Anime[] | null;
	animeListLength (state: State): (version: Version) => number;
	animeListFilteredLength (state: State): (version: Version) => number;
	getAnimeListFiltered (state: State): (version: Version, page: number) => Anime[];
	getAnime (state: State): (version: Version, idInput: number | string) => Anime | null;
}

// Function that return true if the anime name matches the string
// this is used to filter an array threw .filter() method
const filterFunction = (anime: Anime, searchString: string): boolean | undefined => {
	const searchData = searchString
		.trim()
		.toLowerCase();

	return	anime.title?.toLowerCase().includes(searchData) ||
					anime.title_english?.toLowerCase().includes(searchData) ||
					anime.title_romanji?.toLowerCase().includes(searchData);
}

// Function that test if the version type is valid
const isValidVersion = (input: string): boolean => ['vostfr', 'vf'].includes(input);

export const animeListGetters: GetterTree<State, State> & Getters = {
	getAnimeList: (state) => (version) => state[version],

	animeListLength: (state) => (version: Version) => {
		const list = state[version];

		return list
			? list.length
			: -1;
	},

	animeListFilteredLength: (state) => (version) => {
		const animeList = state[version];
		if (!animeList) return 0;

		const searchFilter = useRouter().currentRoute.value.query.search as string | undefined;
		if (!searchFilter) return animeList.length;

		return animeList.filter(anime => filterFunction(anime, searchFilter)).length;
	},

	getAnimeListFiltered: (state) => (version, page) => {
		const animeList = state[version];
		if (!animeList) return [];

		const searchFilter = useRouter().currentRoute.value.query.search as string | undefined;

		if (!searchFilter) {
			return animeList
				.slice( ANIME_PER_PAGE * (page - 1), ANIME_PER_PAGE * page );
		}

		return animeList
			.filter(anime => filterFunction(anime, searchFilter))
			.slice( ANIME_PER_PAGE * (page - 1), ANIME_PER_PAGE * page );
	},

	getAnime: (state) => (version, idInput) => {
		const animeList = state[version];
		if (!animeList) return null;

		const id = (typeof idInput === 'string')
			? parseInt(idInput)
			: idInput;

		if (!isValidVersion(version) || isNaN(id)) return null;

		for (let i=0 ; i<animeList.length ; i++) {
			const anime = animeList[i];
			if (anime.id === id) {
				return anime;
			}
		}

		return null;
	}
}

export default animeListGetters;

