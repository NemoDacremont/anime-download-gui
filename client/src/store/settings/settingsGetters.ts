
import { GetterTree } from 'vuex';
import { SettingsState as State } from './settingsState';
import { AnimeListView } from './settingsTypes';
import { Socket } from 'socket.io-client';

export interface Getters {
	isGridViewSelected(state: State): boolean;
	animeListView(state: State): AnimeListView;
	getSocketIOInstance(state: State): Socket | null;
}

export const getters: GetterTree<State, State> & Getters = {
	isGridViewSelected: (state) => {
		return state.animeListView === 'grid';
	},

	animeListView: (state) => {
		return state.animeListView;
	},

	getSocketIOInstance: (state) => {
		return state.settingsSocketIOInstance;
	}
};

export default getters;


