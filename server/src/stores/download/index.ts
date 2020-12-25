
import { Version } from "../animes";

export type EpisodeLink = string;
export type EpisodeURL = string;
export type AnimeID = number;
export type EpisodeIndex = number;

export type ItemsToDownload = Map< AnimeID, Map< Version, Map< EpisodeIndex, EpisodeURL>>>

export interface DownloadStore {
	//itemsToDownload: Map<AnimeID, Map<EpisodeIndex, EpisodeLink>>
	itemsToDownload: ItemsToDownload;
}

const downloadStore: DownloadStore = {
	itemsToDownload: new Map()
}

export const itemsToDownload = downloadStore.itemsToDownload;

export default downloadStore;
