
import { Progresses } from './downloadTypes';

export interface DownloadState {
	progresses: Progresses;
	isDownloading: boolean;
}

export const downloadState: DownloadState = {
	progresses: {},
	isDownloading: false
};

export default downloadState;

