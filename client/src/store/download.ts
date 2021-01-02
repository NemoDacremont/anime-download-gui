
import { Module } from 'vuex';
import { Version } from './animeList';
import { API_BASE_URL } from '../constants';
import axios from 'axios';

export interface Progresses {
	[animeID: number]: {
		[version in Version]: {
			[episodeIndex: number]: number;
		}
	};
}

export type DownloadAction = 'start' | 'stop';

export default {
	state: {
		progresses: {} as Progresses,
		isDownloading: false
	},

	getters: {
		getProgresses: (state) => state.progresses,
		getVersionProgress: (state) => (animeID: number, version: Version) => {
			const {progresses} = state;
			if (!progresses[animeID]) return null;

			return progresses[animeID][version] || null;
		},
		getEpisodeProgress: (state) => (animeID: number, version: Version, episode: number) => {
			const { progresses } = state;
			if (!progresses[animeID] || !progresses[animeID][version]) return null;

			return progresses[animeID][version][episode] || null;
		},
		isDownloading: (state) => state.isDownloading,
		downloadingState: (state) => state.isDownloading ? 'start': 'stop'
	},

	mutations: {
		updateProgresses: (state, newProgresses: Progresses) => {
			state.progresses = newProgresses;
		},
		forceDownloadState: (state, newState: boolean) => state.isDownloading = newState,
		toggleDownloadState: (state) => state.isDownloading = !state.isDownloading,
	},

	actions: {
		toggleDownload: async ({state, dispatch}) => {
			//commit('toggleDownloadState');
			const action = state.isDownloading ? 'stop': 'start';
			await axios.post(API_BASE_URL + '/download/controlDownload', { action });
			dispatch('loadDownloadState');
		},
		loadDownloadState: async ({commit, state}) => {
			const newState: boolean = (await axios.get(API_BASE_URL + '/download/isDownloading')).data;
			if (typeof newState === 'boolean') commit('forceDownloadState', newState);
		}
	}
} as Module<any, any>;
