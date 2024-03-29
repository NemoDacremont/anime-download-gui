
/*
*		Types|Interfaces, ts things
*/

import { News } from '../../utils/getNews';

/*
	Example of Anime:

	{
		"id": 17183,
		"title": "Osomatsu-san 3",
		"title_english": "",
		"title_romanji": "Osomatsu-san 3",
		"others": "Mr. Osomatsu 3",
		"type": "tv",
		"status": "1",
		"popularity": 8.560080465021827,
		"url": "/anime/info/17183-osomatsu-san-3-vostfr",
		"genres": [],
		"url_image": "https://cdn10.neko-sama.xyz/2/439b968b83f96a704ad09bf8ffe2e91b.jpg",
		"score": "32.50",
		"start_date_year": "2020",
		"nb_eps": "? Eps"
	}
*/

export interface Anime {
	id?: number;
	title?: string;
	title_english?: string;
	title_romanji?: string;
	others?: string;
	type?: string;
	status?: string;
	popularity?: number;
	url?: string;
	genres?: string[];
	url_image?: string;
	score?: string;
	start_date_year?: string;
	nb_eps?: string;
	nb_of_episodes: number;
}

export interface AnimeStore {
	animeList: {
		vostfr: Anime[];
		vf: Anime[];
	},
	news: News;
}

const animeStore: AnimeStore = {
	animeList: {
		vostfr: [],
		vf: []
	},
	news: []
}

export type Version = 'vostfr' | 'vf';

export const vf = animeStore.animeList.vf;
export const vostfr = animeStore.animeList.vostfr;
export const animeList = animeStore.animeList;

export const updateNews = (newNews: News): News => animeStore.news = newNews;

// cache vostfr and vf functions
export * from './cacheAnimeList';

/*
*		Actual store
*/

export { getAnimeFromID } from './getAnimeFromID';
export { Episode, ExtractEpisodeList } from './extractEpisodesList';

export default animeStore;
