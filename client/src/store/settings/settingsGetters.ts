
import { GetterTree } from 'vuex';
import { SettingsState as State } from './settingsState';
import { AnimeListView } from './settingsTypes';

export interface Getters {
	isGridViewSelected(state: State): boolean;
	animeListView(state: State): AnimeListView;
}

export const getters: GetterTree<State, State> & Getters = {
	isGridViewSelected: (state) => {
		return state.animeListView === 'grid';
	},

	animeListView: (state) => {
		return state.animeListView;
	}
};

export default getters;


