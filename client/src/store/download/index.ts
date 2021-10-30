
import { Module } from 'vuex';
import state, { DownloadState } from './downloadState';
import getters from './downloadGetters';
import mutations from './downloadMutations';
import actions from './downloadActions';

export const downloadModule: Module<DownloadState, DownloadState> = {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
};

export default downloadModule;

