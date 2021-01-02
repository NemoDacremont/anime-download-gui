
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
		toggleDownloadState: (state)=> {
			state.isDownloading = !state.isDownloading
		}
	},

	actions: {
		toggleDownload: ({commit, state}) => {
			commit('toggleDownloadState');
			const action = state.isDownloading ? 'start': 'stop';
			axios.post(API_BASE_URL + '/download/controlDownload', { action });
		}
	}
} as Module<any, any>;
