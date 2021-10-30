
import { Module } from 'vuex';

import state, { AnimeListState } from './animeListState';
import getters from './animeListGetters';
import mutations from './animeListMutations';
import actions from './animeListActions';

export const animeListModule: Module<AnimeListState, AnimeListState> = {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
};

export default animeListModule;

