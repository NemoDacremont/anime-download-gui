
import { MutationTree } from 'vuex';
import { DownloadState as State } from './downloadState';
import { Progresses } from './downloadTypes';

type dState = "down" | "pause" | "resume" | "up" | "stop" | "paused";

export interface DownloadMutations {
	updateProgresses (state: State, newProgresses: Progresses): void;
	forceDownloadState (state: State, newState: dState): void;
	toggleDownloadState (state: State): void;
}


export const downloadMutations: MutationTree<State> & DownloadMutations = {
	updateProgresses: (state, newProgresses: Progresses) => {
		state.progresses = newProgresses;
	},
	forceDownloadState: (state, newState: dState) => state.downloadState = newState,
	forceIsDownloading: (state, newState: boolean) => state.isDownloading = newState,
	toggleDownloadState: (state) => {console.log("toggle");state.isDownloading = !state.isDownloading},
}


export default downloadMutations;

