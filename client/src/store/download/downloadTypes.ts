
import { Version } from '../animeList/animeListTypes';

export interface Progress {
	progress: number;
	state: string;
}

export interface VersionProgress {
	[episodeIndex: number]: Progress;
}

export interface Progresses {
	[animeID: number]: {
		[version in Version]: VersionProgress;
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

export type DownloadingState = 'started' | 'stopped';

export interface Episode {
	time: string;
	episode: string;
	title: string;
	url: string;
	url_image: string;
}

