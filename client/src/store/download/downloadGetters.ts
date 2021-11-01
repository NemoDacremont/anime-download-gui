
import { GetterTree } from 'vuex';

import { DownloadState as State } from './downloadState';
import { Progresses, Progress, DownloadingState, VersionProgress } from './downloadTypes';
import { Version } from '../animeList/animeListTypes';

export interface DownloadGetters {
	getProgresses (state: State): Progresses;
	getVersionProgress (state: State): (animeID: number, version: Version) => VersionProgress | null;
	getEpisodeProgress (state: State): (animeid: number | string, version: Version, episode: number) => Progress | null;
	isDownloading (state: State): boolean;
	downloadingState (state: State): DownloadingState;
}

export const downloadGetters: GetterTree<State, State> & DownloadGetters = {
	getProgresses: (state) => state.progresses,
	getVersionProgress: (state) => (animeID, version ) => {
		const { progresses } = state;
		if (!progresses[animeID]) return null;

		return progresses[animeID][version] || null;
	},
	getEpisodeProgress: (state) => (animeID, version, episode) => {
		const { progresses } = state;

		// parse animeID as an int
		const animeid = (typeof animeID === 'string')
			? parseInt(animeID)
			: animeID;

		if (!progresses[animeid] || progresses[animeid] && !progresses[animeid][version]) return null;

		return progresses[animeid][version][episode] || null;
	},
	isDownloading: (state) => state.isDownloading,
	downloadingState: (state) => state.isDownloading ? 'started': 'stopped'
}

export default downloadGetters;

