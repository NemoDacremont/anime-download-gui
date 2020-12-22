
import { Module } from 'vuex';

import { DEFAULT_VIEW, DefaultView } from '../constants';

export type AnimeListView = DefaultView;

interface State {
	animeListView: AnimeListView;
}

export default {
	state: {
		animeListView: DEFAULT_VIEW,
	},

	getters: {
		isGridViewSelected: (state): boolean => state.animeListView === 'grid',
		animeListView: (state): AnimeListView => state.animeListView
	},

	mutations: {
		setAnimeListView: (state, newValue: AnimeListView) => {
			console.log('setAnimeListView')
			state.animeListView = newValue;
		}
	}
} as Module<State, any>
