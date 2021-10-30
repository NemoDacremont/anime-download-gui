
import { MutationTree } from 'vuex';
import { DownloadState as State } from './downloadState';
import { Progresses } from './downloadTypes';

export interface DownloadMutations {
	updateProgresses (state: State, newProgresses: Progresses): void;
	forceDownloadState (state: State, newState: boolean): void;
	toggleDownloadState (state: State): void;
}

export const downloadMutations: MutationTree<State> & DownloadMutations = {
	updateProgresses: (state, newProgresses: Progresses) => {
		state.progresses = newProgresses;
	},
	forceDownloadState: (state, newState: boolean) => state.isDownloading = newState,
	toggleDownloadState: (state) => state.isDownloading = !state.isDownloading,
}

export default downloadMutations;

