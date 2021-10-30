
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

export type Version = 'vostfr' | 'vf'

export interface LoadDataPayload {
	version: Version;
	data: Anime[];
}

export interface SelectedAnime {
	id: number;
	start: number;
	end: number;
}

export interface AnimeListOutput {
	getAnimeList: Anime[];
	getAnimeListFiltered: Anime[];
	animeListLength: number;
	animeListFilteredLength: number;
	getAnime: (version: Version, id: number) => Anime;
	loadData: void | boolean;
}

