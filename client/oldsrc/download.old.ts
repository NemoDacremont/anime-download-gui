
import { createStore } from 'vuex';
import { Version } from './animeList';
import { API_BASE_URL } from '@/constants';
import axios from 'axios';


/*
 * 	Interfaces declaration
 */
export interface Progress {
	progress: number;
	state: string;
}

export interface Progresses {
	[animeID: number]: {
		[version in Version]: {
			[episodeIndex: number]: Progress;
		}
	};
}

export interface SelectedEpisode {
	episodeIndex: number;
	title: string;
}

export interface SelectedEpisodes {
	[animeId: number]: {
		[version in Version]: SelectedEpisode[]
	};
}

export type DownloadAction = 'start' | 'stop';

export interface Episode {
	time: string;
	episode: string;
	title: string;
	url: string;
	url_image: string;
}

/*
 * 	End of interfaces declaration
 */


/*
 * 	Download state declaration
 */

export interface DownloadState {
	progresses: Progresses;
	isDownloading: boolean;
}

/*
 * 	End of download state declaration
 */

export const downloadStore = createStore<DownloadState>({
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
		getEpisodeProgress: (state) => (animeID: number | string, version: Version, episode: number) => {
			const { progresses } = state;

			// parse animeID as an int
			const animeid = (typeof animeID === 'string')
				? parseInt(animeID)
				: animeID;

			if (!progresses[animeid] || progresses[animeid] && !progresses[animeid][version]) return null;

			return progresses[animeid][version][episode] || null;
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
		loadDownloadState: async ({commit}) => {
			const newState = (await axios.get(API_BASE_URL + '/download/isDownloading')).data;
			if (typeof newState === 'boolean') commit('forceIsDownloading', newState);
		},
	}
});

export default downloadStore;
