
import { Module } from 'vuex';
import axios from 'axios';

import { API_BASE_URL } from '../constants';

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

interface State {
	vostfr: Anime[] | null;
	vf: Anime[] | null;
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
		animeListLength: (state) => (version: Version): number => {
			const list = state[version];

			return list
				? list.length
				: -1
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
} as Module<State, any>;
