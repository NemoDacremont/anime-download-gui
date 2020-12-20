
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
	}
}

const animeStore: AnimeStore = {
	animeList: {
		vostfr: [],
		vf: []
	}
}

export default animeStore;
