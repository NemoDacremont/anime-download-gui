
import { Module } from 'vuex';
import { Version } from './animeList';

interface Progresses {
	[animeID: number]: {
		[version in Version]: number[];
	};
}

export default {
	state: {
		progresses: {
		} as Progresses
	},

	getters: {
		getProgresses: (state) => state.progresses,
		getVersionProgress: (state) => (animeID: number, version: Version) => {
			const {progresses} = state;
			if (!progresses[animeID]) return null;

			return progresses[animeID][version] || null;
		},
		getEpisodeProgress: (state) => (animeID: number, version: Version, episodeIndex: number) => {
			const {progresses} = state;
			if (!progresses[animeID] || !progresses[animeID][version]) return null;

			return progresses[animeID][version][episodeIndex] || null;
		}
	},

	mutations: {
		updateProgresses: (state) => (newProgresses: Progresses) => {
			state.progresses = newProgresses;
		}
	}
} as Module<any, any>;
