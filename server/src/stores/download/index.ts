
//import { Version } from "../animes";
import { Downloader, ItemsToDownload } from './downloader';

export type EpisodeLink = string;
export type EpisodeURL = string;
export type AnimeID = number;
export type EpisodeIndex = number;

//

export const downloader = new Downloader();
export const getCachedEpisodes = downloader.getCachedEpisodes;

export interface DownloadStore {
	//itemsToDownload: Map<AnimeID, Map<EpisodeIndex, EpisodeLink>>
	itemsToDownload: ItemsToDownload;
}

const downloadStore: DownloadStore = downloader.store;

export const itemsToDownload = downloadStore.itemsToDownload;
export const downloadAction = downloader.actionListener;

export default downloadStore;
