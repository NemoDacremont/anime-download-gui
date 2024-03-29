
import { createStore, Store} from 'vuex';
import { InjectionKey } from 'vue';
import axios from 'axios';

import { API_BASE_URL, ANIME_PER_PAGE } from '@/constants';

/*
 * 	Interfaces declaration
 */

export interface Anime {
	id?: number;
	title?: string;
	title_english?: string;
	title_romanji?: string;
	others?: string;
	type?: string;
	status?: string;
	popularity?: number;
	url?: string;
	genres?: string[];
	url_image?: string;
	score?: string;
	start_date_year?: string;
	nb_eps?: string;
	nb_of_episodes: number;
}

export type Version = 'vostfr' | 'vf'

export interface LoadDataPayload {
	version: Version;
	data: Anime[];
}

export interface SelectedAnime {
	id: number;
	start: number;
	end: number;
}

export interface AnimeListOutput {
	getAnimeList: Anime[];
	getAnimeListFiltered: Anime[];
	animeListLength: number;
	animeListFilteredLength: number;
	getAnime: (version: Version, id: number) => Anime;
	loadData: void | boolean;
}

/*
 * 	End of interfaces declaration
 */


/*
 * 	State declaration
 */

export interface AnimeListState {
	vostfr: Anime[] | null;
	vf: Anime[] | null;
	selectedAnimes: Map<number, Anime>;
}

export const animeListKey: InjectionKey<Store<AnimeListState>> = Symbol();

/*
 * 	State declaration
 */

// Download the anime list from the local server
const load = async (version: 'vostfr' | 'vf'): Promise<Anime[]> => {
	return (await axios.get( `${API_BASE_URL}/animes/animelist/${version}` )).data
}

// Use Router ??
import { useRouter } from 'vue-router';

const filterFunction = (anime: Anime, searchString: string) => {
	const searchData = searchString
		.trim()
		.toLowerCase();

	return	anime.title?.toLowerCase().includes(searchData) ||
					anime.title_english?.toLowerCase().includes(searchData) ||
					anime.title_romanji?.toLowerCase().includes(searchData);
}

const isValidVersion = (input: string): boolean => ['vostfr', 'vf'].includes(input);

export const animeListStore = createStore<AnimeListState>({
	state: {
		vostfr: null,
		vf: null,
		selectedAnimes: new Map()
	},

	getters: {
		getAnimeList: (state) => (version: Version) => state[version],
		animeListLength: (state) => (version: Version) => {
			const list = state[version];

			return list
				? list.length
				: -1
		},
		animeListFilteredLength: (state) => (version: Version, searchFilter?: string) => {
			const animeList = state[version];
			if (!animeList) return [];

			if (!searchFilter) return animeList.length;

			return animeList.filter(anime => filterFunction(anime, searchFilter)).length;
		},
		getAnimeListFiltered:
			(state) => (version: Version, page: number/*, searchFilter?: string*/) => {
			const animeList = state[version];
			if (!animeList) return [];

			const searchFilter = useRouter().currentRoute.value.query.search as string | undefined

			if (!searchFilter) {
				return animeList
					.slice( ANIME_PER_PAGE * (page - 1), ANIME_PER_PAGE * page );
			}

			return animeList
				.filter(anime => filterFunction(anime, searchFilter))
				.slice( ANIME_PER_PAGE * (page - 1), ANIME_PER_PAGE * page );
		},
		getAnime: (state) => (version: Version, idInput: number | string) => {
			const animeList = state[version];
			if (!animeList) return null;

			const id = typeof idInput === 'string' ? parseInt(idInput): idInput;

			if (!isValidVersion(version) || isNaN(id)) return false;

			for (let i=0 ; i<animeList.length ; i++) {
				const anime = animeList[i];
				if (anime.id === id) {
					return anime;
				}
			}

			return false;
		}
	},

	mutations: {
		loadData (state, payload: LoadDataPayload) {
			const { version, data } = payload;
			state[version] = data;
		}
	},

	actions: {
		async loadData (store, version: 'vostfr' | 'vf'): Promise<boolean> {
			const data = await load(version);
			store.commit('loadData', {
				version,
				data
			});
			return true;
		}
	}
});

export default animeListStore;
