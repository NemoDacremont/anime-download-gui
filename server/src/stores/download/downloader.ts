
import { EventEmitter } from 'events';
import downloadEpisode from './downloadScript';

import { outputDir } from '../../constants';

// Doing TS things

import { getAnimeFromID, Version, Episode, ExtractEpisodeList } from '../animes';
import extractURL from '../../routes/api/animes/getURL/extractURL';

export type EpisodeLink = string;
export type EpisodeURL = string;
export type AnimeID = number;
export type EpisodeIndex = number;

// Some stupidly complex items to store anime information
export type ItemsToDownload = Map< AnimeID, Map< Version, Set<EpisodeIndex> >>
export type AnimeEpisodesInformation = Map<AnimeID, Map<Version, Map<EpisodeIndex, Episode> >>

export interface DownloadStore {
	//itemsToDownload: Map<AnimeID, Map<EpisodeIndex, EpisodeLink>>
	itemsToDownload: ItemsToDownload;
	animeEpisodesInformation: AnimeEpisodesInformation;
}


//

class ActionListener extends EventEmitter {}

//


export class Downloader {
	public readonly actionListener: ActionListener;
	public readonly store: DownloadStore;
	private isDownloading: boolean;
	

	// Constructor
	constructor (/*actionListener: ActionListener*/) {
		this.actionListener = new ActionListener();

		this.store = {
			itemsToDownload: new Map(),
			animeEpisodesInformation: new Map()
		};
		this.isDownloading = false;

		this.actionListener.on('startDownload', () => {
			this.download();
		});

		this.actionListener.on('stopDownload', () => {
			this.isDownloading = false;
		})
	}

	/*
	 *	Methods
	*/


	getCachedEpisodes (animeID: AnimeID, version: Version): Promise<Map<EpisodeIndex, Episode> | null>;
	getCachedEpisodes (animeID: AnimeID, version: Version, episode: EpisodeIndex): Promise< Episode | null >;

	public async getCachedEpisodes (animeID: AnimeID, version: Version, episode?: EpisodeIndex): Promise< Map<EpisodeIndex, Episode> | Episode | null > {
		const { animeEpisodesInformation } = this.store;
		
		const animeEntry = animeEpisodesInformation.get(animeID);
		if (!animeEntry) return await this.cacheEpisodes(animeID, version);

		const versionEntry = animeEntry.get(version);
		if (!versionEntry) return await this.cacheEpisodes(animeID, version);

		if (episode) return versionEntry.get(episode) || null;

		return versionEntry;
	}


	cacheEpisodes (animeID: AnimeID, version: Version): Promise<Map<EpisodeIndex, Episode> | null>;
	cacheEpisodes (animeID: AnimeID, version: Version, episode: EpisodeIndex): Promise< Episode | null >;

	public async cacheEpisodes (animeID: AnimeID, version: Version, episode?: number): Promise< Map<EpisodeIndex, Episode> | Episode | null > {
		const { animeEpisodesInformation } = this.store;

		if (!animeEpisodesInformation.get(animeID)) {
			animeEpisodesInformation.set(animeID, new Map());
			const animeEntry = animeEpisodesInformation.get(animeID);

			animeEntry?.set(version, new Map());
		}

		const versionEntry = animeEpisodesInformation.get(animeID)?.get(version);
		if (!versionEntry) return null;

		const anime = getAnimeFromID(version, animeID);
		if (!anime) return null;

		const episodesRaw = await ExtractEpisodeList( anime );
		if (!episodesRaw) return null;

		episodesRaw.forEach((episode) => {
			const episodeIndexRaw = episode.episode.match(/\d+$/);
			if (!episodeIndexRaw) return;

			const episodeIndex = parseInt(episodeIndexRaw[0]);
			if (!episodeIndexRaw) return;

			versionEntry.set(episodeIndex, episode);
		});

		if (episode) return versionEntry.get(episode) || null;

		return versionEntry;
	}

	private async download (): Promise<void> {
		// return if is downloading to prevent multiple download instance
		if (this.isDownloading) return;

		const { itemsToDownload: downloadList} = this.store;
		this.isDownloading = true;

		// A lot of for loops to iterate threw this stupidly giant object
		for (let animeEntry of downloadList.entries()) {
			const [ animeID, versions ] = animeEntry;

			for (let versionEntry of versions.entries()) {
				const [ version, episodes] = versionEntry;
				const anime = getAnimeFromID(version, animeID);
				if (!anime) continue;

				const episodesData = await this.getCachedEpisodes(animeID, version);
				if (!episodesData) continue;

				for (let episodeEntry of episodes.entries()) {
					const [ index, episodeIndex] = episodeEntry;
					console.log('episode:', episodeIndex);

					const episode = episodesData.get(episodeIndex);
					if (!episode) continue;

					const formattedTitle = anime.title?.replace(/ /g, '_').replace(/\W/g, "").toLocaleLowerCase();

					const filePath = `${outputDir}/animesDownloaded/${formattedTitle}-${animeID}/${version}/episode_${episodeIndex}.mp4`;
					const episodeURL = await (extractURL(animeID, version, episodeIndex).catch((err) => console.log(err)));
					if (!episodeURL) continue;

					console.log(`Downloading: ${anime.title} | ${version} | ${episode.episode}`);

					await (downloadEpisode(filePath, episodeURL, {
						forceReject: () => {
							return !this.isDownloading;
						}
					}).catch((err: Error) => console.log(err.message)));
					console.log(`${anime.title} ${episode.episode} Downloaded!`);
					// Stop downloading if a cancel request has been used
					if (!this.isDownloading) return;

				}
			}
		}

		downloadList.forEach((anime, key) => {
			downloadList.delete(key);
		});
		console.log('Download finished');
		this.isDownloading = false;
	}
	// End download method
}

