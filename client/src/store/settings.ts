
import { Module } from 'vuex';

import { DEFAULT_VIEW, DefaultView } from '@/constants';

export type AnimeListView = DefaultView;

export interface SettingsState {
	animeListView: AnimeListView;
}

export interface SettingsOutput {
	isGridViewSelected: boolean;
	animeListView: AnimeListView;
	setAnimeListView: void;
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
			state.animeListView = newValue;
		}
	}
} as Module<SettingsState, any>
