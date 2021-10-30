
import { Module } from 'vuex';
import state, { SettingsState } from './settingsState';
import getters from './settingsGetters';
import mutations from './settingsMutations';

export const settingsModule: Module<SettingsState, SettingsState> = {
	namespaced: true,
	state,
	getters,
	mutations
};

export default settingsModule;

