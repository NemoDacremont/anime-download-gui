
import { Anime } from './animeListTypes';

export interface AnimeListState {
	vostfr: Anime[] | null;
	vf: Anime[] | null;
	selectedAnimes: Map<number, Anime>;
}

export const animeListState: AnimeListState = {
	vostfr: null,
	vf: null,
	selectedAnimes: new Map()
}

export default animeListState;

