
import { Module } from 'vuex';
import axios from 'axios';

import { API_BASE_URL, ANIME_PER_PAGE } from '../constants';

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

export interface AnimeListState {
	vostfr: Anime[] | null;
	vf: Anime[] | null;
}

export interface AnimeListOutput {
	getAnimeList: Anime[];
	getAnimeListFiltered: Anime[];
	animeListLength: number;
	animeListFilteredLength: number;
	loadData: void | boolean;
}

const load = async (version: 'vostfr' | 'vf'): Promise<Anime[]> => {
	return (await axios.get( `${API_BASE_URL}/animes/animelist/${version}` )).data
}

export default {
	state: {
		vostfr: null,
		vf: null
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

			const filterFunction = (anime: Anime) => {
				const searchData = searchFilter
					.trim()
					.toLowerCase();

				return anime.title?.toLowerCase().includes(searchData);
			}

			return animeList.filter(filterFunction).length;
		},
		getAnimeListFiltered:
			(state) => (version: Version, page: number, searchFilter?: string) => {
			const animeList = state[version];
			if (!animeList) return [];

			if (!searchFilter) {
				return animeList
					.slice( ANIME_PER_PAGE * (page - 1), ANIME_PER_PAGE * page );
			}

			const filterFunction = (anime: Anime) => {
				const searchData = searchFilter
					.trim()
					.toLowerCase();

				return anime.title?.toLowerCase().includes(searchData);
			}

			return animeList
				.filter(filterFunction)
				.slice( ANIME_PER_PAGE * (page - 1), ANIME_PER_PAGE * page );
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
} as Module<AnimeListState, AnimeListOutput>;
