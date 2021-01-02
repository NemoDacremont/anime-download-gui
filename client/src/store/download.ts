
import { Module } from 'vuex';
import { Version } from './animeList';

export interface Progresses {
	[animeID: number]: {
		[version in Version]: {
			[episodeIndex: number]: number;
		}
	};
}

export default {
	state: {
		progresses: {} as Progresses
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
		}
	},

	mutations: {
		updateProgresses: (state, newProgresses: Progresses) => {
			state.progresses = newProgresses;
		}
	}
} as Module<any, any>;
