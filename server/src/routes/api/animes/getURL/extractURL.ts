
import axios from 'axios';

import extractURLFromPlayer from './extractURLFromPlayer';
import { downloader } from '../../../../stores/download';
//import m3u8 from 'mpd-m3u8-to-json';

// m3u8 types
export type AttrInfo = string | number | Array<string | number> | Object;
export type TagInfo = {
    [propName: string]: AttrInfo;
    //url?: string;
};
export type Segment = {
    start: number;
    end: number;
    duration: number;
    url: string;
    cc: number;
    sn: number;
    keyIndex?: number;
};
export type LevelM3u8 = {
    master: boolean;
    m3u8Url: string;
    duration: number;
    segments: Array<Segment>;
    startSN: number;
    endSN: number;
    live: boolean;
    key?: Array<any>;
};
export type Level = {
    m3u8Url: string;
    levelId: number;
    brandwidth?: number;
    codecs?: string;
    audio?: string;
    details?: LevelM3u8;
};
export type MasterM3u8 = {
    master: boolean;
    m3u8Url: string;
    medias: Array<any>;
    levels: Array<Level>;
    map?: {
        url: string;
    };
};
export type M3u8JSON = MasterM3u8 | LevelM3u8 | {
    error: 1;
    msg: string;
};
//


export default async function (animeID: number, version: 'vostfr' | 'vf', episode: number): Promise<string | M3u8JSON | null> {

	const nekoSamaBaseURL = 'https://neko-sama.fr';
	const episodeData = await downloader.getCachedEpisodes(animeID, version, episode);
	if (!episodeData) return null;

	const episodeURL = nekoSamaBaseURL + episodeData.url;

	const animePage: string = (await axios.get(episodeURL)).data;
	const playersSources = animePage.match(/https?:\/\/((www)|(embed))\.((pstream)|(mystream))\.((net)|(to))\/(\w+\/)?\w+/g);
	if (!playersSources) throw new Error(`The episode you're looking for doesn't look like existing`);

	for (let i=playersSources.length-1 ; i>=0 ; i--) {
		const url = await extractURLFromPlayer(playersSources[i]);
		if (url) return url;
	}

	// Blob support



	throw new Error("An error occurred during source url scraping");
}
