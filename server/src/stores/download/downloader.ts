
import { EventEmitter } from 'events';
import downloadEpisode, { DownloadCallbacks } from './downloadScript';
import downloadM3u8 from './downloadM3u8';

import { outputDir } from '../../constants';

// Doing TS things

import { getAnimeFromID, Version, Episode, ExtractEpisodeList } from '../animes';
import extractURL from '../../scripts/getURL/extractURL';
import socketIOStore from '../socketIO';

//	Actually getSourceFile is used in the extractURL function
//import { getSourceFile } from '../../scripts/getURL/URLExtractor';

export type EpisodeLink = string;
export type EpisodeURL = string;
export type AnimeID = number;
export type EpisodeIndex = number;

// Some stupidly complex items to store anime information, may obviously be improved
export type ItemsToDownload = Map< AnimeID, Map< Version, Set<EpisodeIndex> >>
export type AnimeEpisodesInformation = Map<AnimeID, Map<Version, Map<EpisodeIndex, Episode> >>

export interface EpisodeProgress {
	progress: number;
	state: string;
}
export type Progresses = Map< AnimeID, Map< Version, Map<EpisodeIndex, EpisodeProgress> >>

export interface DownloadStore {
	//itemsToDownload: Map<AnimeID, Map<EpisodeIndex, EpisodeLink>>
	itemsToDownload: ItemsToDownload;
	animeEpisodesInformation: AnimeEpisodesInformation;
	progresses: Progresses;
}

export interface  ParsedDownloadList {
	[animeID: number]: {
		[version in Version]?: number[];
	}
}

export interface ParsedProgressesVersionEntry {
	[episodeIndex: number]: EpisodeProgress;
}
export interface ParsedProgresses {
	[animeID: number]: {
		[version in Version]?: ParsedProgressesVersionEntry;
	}
}

//

class ActionListener extends EventEmitter {}

//

const onlyIncludesNumber = (arr: any[]): boolean => {
	for (const element of arr) if (typeof element !== 'number') return false;
	return true;
}


export class Downloader {
	public readonly actionListener: ActionListener;
	public readonly store: DownloadStore;
	public isDownloading: boolean;
	

	// Constructor
	constructor (/*actionListener: ActionListener*/) {
		this.actionListener = new ActionListener();

		this.store = {
			itemsToDownload: new Map(),
			animeEpisodesInformation: new Map(),
			progresses: new Map()
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

	public selectEpisode (animeID: AnimeID, version: Version, episodes: number | number[]): void {
		const { itemsToDownload, progresses } = this.store;

		// actually boolean isn't useful I think
		// this isn't handled by the router, TO-DO: return boolean to handle next()

		// Check all entries and create them if needed
		if (!itemsToDownload.has(animeID)) itemsToDownload.set(animeID, new Map());
		if (!progresses.has(animeID)) progresses.set(animeID, new Map());

		const animeEntry = itemsToDownload.get(animeID);
		const animeProgress = progresses.get(animeID);
		if (!animeProgress || !animeEntry) return;

		if (!animeEntry.has(version)) animeEntry.set(version, new Set());
		if (!animeProgress.has(version)) animeProgress.set(version, new Map());

		const versionEntry = animeEntry.get(version);
		const versionProgress = animeProgress.get(version);
		if (!versionProgress || !versionEntry) return;

		if (typeof episodes === 'number') {
			// Version entry is a set, no need to check value
			versionEntry.add(episodes);
			const progress: EpisodeProgress = {
				progress: 0,
				state: 'waiting'
			}

			if (!versionProgress.has(episodes)) versionProgress.set(episodes, progress);
		}
		else if (Array.isArray(episodes) && onlyIncludesNumber(episodes)) {
			for (let episode of episodes) {
				// Again, versionEntry is a set
				versionEntry.add(episode);
				const progress: EpisodeProgress = {
					progress: 0,
					state: "waiting"
				}

				if (!versionProgress.has(episode)) versionProgress.set(episode, progress);
			}
		}

	}

	public unSelectEpisodes (animeID: AnimeID, version?: Version, episodes?: number | number[]): void {
		const { itemsToDownload, progresses } = this.store;

		// if no version is passed, unselect the entire anime
		const animeEntry = itemsToDownload.get(animeID);
		const animeProgress = progresses.get(animeID)
		if (!animeEntry || !animeProgress) return;

		if (!version) {
			itemsToDownload.delete(animeID);
			progresses.delete(animeID);
		}
		// If a version is passed, 
		else {
			const versionEntry = animeEntry.get(version);
			const versionProgress = animeProgress.get(version);
			if (!versionEntry || !versionProgress) return;

			if (episodes) {
				if (typeof episodes === 'number') {
					versionEntry.delete(episodes);
					versionProgress.delete(episodes);
				}
				else if (Array.isArray(episodes) && onlyIncludesNumber(episodes)) {
					episodes.forEach((episode) => {
						versionEntry.delete(episode);
						versionProgress.delete(episode);
					});
				}
			}
			else {
				animeEntry.delete(version);
				animeProgress.delete(version);
			}

			// If there isn't episode selected anymore, delete the highest entry
			// versionEntry.size is if episodes as been passed as argument
			if (versionEntry.size === 0) {
				if (animeEntry.size === 1) itemsToDownload.delete(animeID);
				else if (animeEntry.get(version === 'vostfr' ? 'vf': 'vostfr')?.size === 0) itemsToDownload.delete(animeID);
				else animeEntry.delete(version);
			}
			if (animeEntry.size === 0) itemsToDownload.delete(animeID);

			if (versionProgress.size === 0) {
				if (animeProgress.size === 1) progresses.delete(animeID);
				else if (animeEntry.get(version === 'vostfr' ? 'vf': 'vostfr')?.size === 0) progresses.delete(animeID);
				else animeProgress.delete(version);
			}
			if (animeProgress.size === 0) progresses.delete(animeID);
		}
	}

	private getProgress (animeID: AnimeID, version: Version, episode: number): EpisodeProgress | null {
		const { progresses } = this.store;

		const animeEntry = progresses.get(animeID);
		if (!animeEntry) return null;

		const versionEntry = animeEntry.get(version);
		if (!versionEntry) return null;

		return versionEntry.get(episode) || null;
	}

	private updateProgresses (animeID: AnimeID, version: Version, episode: number, newProgress: EpisodeProgress): void {
		const { progresses } = this.store;

		if (!this.getProgress(animeID, version, episode)) return;

		progresses.get(animeID)?.get(version)?.set(episode, newProgress);
	}

	public getParsedProgresses () {
		const { progresses } = this.store;

		const output: ParsedProgresses = {};

		progresses.forEach((versions, animeID) => {

			output[animeID] = {};
			const animeEntry = output[animeID];
			versions.forEach((episodes, version) => {
				const versionEntry: ParsedProgressesVersionEntry = animeEntry[version] = {};
				episodes.forEach((episodeProgress, episodeIndex) => {
					versionEntry[episodeIndex] = episodeProgress;
				})
			});
		});

		return output;
	}

	public getParsedDownloadList () {
		const { itemsToDownload } = this.store;

		const output: ParsedDownloadList = {};

		itemsToDownload.forEach((versions, animeID) => {

			output[animeID] = {};
			const animeEntry = output[animeID];
			versions.forEach((episodes, version) => {
				animeEntry[version] = [...episodes];
			});
		});

		return output;
	}

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

		const { itemsToDownload: downloadList } = this.store;
		this.isDownloading = true;
		socketIOStore.socketIOInstance?.emit('updateDownloadState', this.isDownloading);

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

					const episodeProgress = this.getProgress(animeID, version, episodeIndex);
					// Actually this case shouldn't happen, I'll handle it later
					if (!episodeProgress) continue;
					this.updateProgresses(animeID, version, episodeIndex, { ...episodeProgress, state: 'downloading' });
					socketIOStore.socketIOInstance?.emit('progress', this.getParsedProgresses());

					const episode = episodesData.get(episodeIndex);
					if (!episode) continue;

					const formattedTitle = anime.title?.replace(/ /g, '_').replace(/\W/g, "").toLocaleLowerCase();

					const episodeSource = await (extractURL(animeID, version, episodeIndex).catch((err) => {
						console.error(`Error while extracting URL, the file may not exist,error: ${err.message}`);
						this.updateProgresses(animeID, version, episodeIndex, { ...episodeProgress, state: 'File deleted' });
						socketIOStore.socketIOInstance?.emit('progress', this.getParsedProgresses());
					}));
					// test if source is void, if yes, download next episode
					if (!episodeSource) continue;

					const fileExtension = "mp4"; /*old system, now all should be mp4*/ //typeof episodeSource === 'string' ? 'mp4': 'ts';
					// Creating episode name by completing with 0 to be able to sort by name
					const formattedEpisode = `${'0'.repeat(episodesData.size.toString().length - episodeIndex.toString().length) }${episodeIndex}`
					const filePath = `${outputDir}/animesDownloaded/${formattedTitle}-${animeID}/${version}/episode_${formattedEpisode}.${fileExtension}`;

					console.log(`Downloading: ${anime.title} | ${version} | ${episode.episode}`);
					console.log('outFile:', filePath);

					const downloadsCallbacks: DownloadCallbacks = {
						forceReject: (): boolean => {
							return !this.isDownloading;
						},
						onData: (progress: number): void => {
							const updatedProgress = this.getProgress(animeID, version, episodeIndex);
							if (!updatedProgress) return;

							updatedProgress.progress = progress;
							this.updateProgresses(animeID, version, episodeIndex, updatedProgress);

							// Update in the client
							const output = this.getParsedProgresses();
							socketIOStore.socketIOInstance?.emit('progress', output);
						}
					}

					console.log("Source:");
					console.log(episodeSource);

					// If the source is an url, download the file normally
					if(episodeSource.type === "MP4") {
						const episodeURL = episodeSource.URL;

						await (downloadEpisode(filePath, episodeURL, downloadsCallbacks).catch((err: Error) => console.log(err.message)));
					}

					// If the source is m3u8 (ts files) => download with ffmpeg
					else if (episodeSource.type === "M3U8") {
						await (
							downloadM3u8(filePath, episodeSource, downloadsCallbacks).catch((err) => console.log(err.message))
								.catch((err: Error) => console.error(err))
						);
					}

					console.log(`${anime.title} ${episode.episode} Downloaded!`);

					// Have to re-get because of progress value
					const updateState = this.getProgress(animeID, version, episodeIndex);
					if (updateState) this.updateProgresses(animeID, version, episodeIndex, { ...updateState, state: 'Downloaded' });
					socketIOStore.socketIOInstance?.emit('progress', this.getParsedProgresses());

					// Stop downloading if a cancel request has been used
					if (!this.isDownloading) return;
				}
			}
		}

		for (const anime of downloadList) {
			const [key] = anime;
			downloadList.delete(key);
		}

		console.log('Download finished');
		this.isDownloading = false;
		socketIOStore.socketIOInstance?.emit('updateDownloadState', this.isDownloading);
		socketIOStore.socketIOInstance?.emit('updateSelectedAnime');
	}
	// End download method
}

