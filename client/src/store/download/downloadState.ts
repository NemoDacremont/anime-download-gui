
import { Progresses } from './downloadTypes';

export interface DownloadState {
	progresses: Progresses;
	isDownloading: boolean;
	downloadState: "down" | "pause" | "resume" | "up" | "stop" | "paused";
}

export const downloadState: DownloadState = {
	progresses: {},
	isDownloading: false,
	downloadState: "down"
};

export default downloadState;

