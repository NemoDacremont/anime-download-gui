
import { createStore } from 'vuex';
import axios from 'axios';

import { constants } from '.';

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

export interface LoadDataPayload {
	version: 'vostfr' | 'vf';
	data: Anime[];
}

const load = async (version: 'vostfr' | 'vf'): Promise<Anime[]> => {
	return (await axios.get( `${constants.state.API_BASE_URL}/animes/animelist/${version}` )).data
}

export default createStore({
	state: {
		vostfr: null,
		vf: null
	} as {
		vostfr: Anime[] | null;
		vf: Anime[] | null;
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
