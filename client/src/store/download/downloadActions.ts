
import { ActionTree, ActionContext } from 'vuex';

import { DownloadMutations as Mutations } from './downloadMutations';
import { DownloadState as State } from './downloadState';

// dep
import axios from 'axios';
import { API_BASE_URL } from '@/constants';

// Needed type
type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
	): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, 'commit'>

export interface DownloadActions {
	toggleDownload ( {commit, dispatch}: AugmentedActionContext ): void;
	loadDownloadState ( {commit}: AugmentedActionContext ): void;
}

export const downloadActions: ActionTree<State, State> & DownloadActions = {
	toggleDownload: async ({state, dispatch, commit}) => {
		//commit('toggleDownloadState');
		const action = state.isDownloading ? 'stop': 'start';
		await axios.post(API_BASE_URL + '/download/controlDownload', { action });
		commit('toggleDownloadState', undefined);
		dispatch('loadDownloadState');
	},
	pauseDownload: async ({ dispatch }) => {
		const action = "pause";
		await axios.post(API_BASE_URL + '/download/controlDownload', { action });
		dispatch('loadDownloadState');
	},
	resumeDownload: async ({ dispatch }) => {
		const action = "resume";
		await axios.post(API_BASE_URL + '/download/controlDownload', { action });
		dispatch('loadDownloadState');
	},
	loadDownloadState: async ({commit}) => {
		const newState = (await axios.get(API_BASE_URL + '/download/getDownloadState')).data as "down" | "pause" | "resume" | "up" | "stop" | "paused";
		if (typeof newState === 'string') commit('forceDownloadState', newState);
	},
};

export default downloadActions;

