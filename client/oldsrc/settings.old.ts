
import { createStore, Module } from 'vuex';

import { DEFAULT_VIEW, DefaultView } from '@/constants';

/*
 * 	Interfaces declaration
 */
export type AnimeListView = DefaultView;

/*
 * 	End of interfaces declaration
 */


/*
 *  State declaration
 */

export interface SettingsState {
	animeListView: AnimeListView;
}

export interface SettingsOutput {
	isGridViewSelected: boolean;
	animeListView: AnimeListView;
	setAnimeListView: void;
}

/*
 *  End of state declaration
 */

export const settingsModule : Module<SettingsState, SettingsState> = {
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
};

export default settingsModule;

