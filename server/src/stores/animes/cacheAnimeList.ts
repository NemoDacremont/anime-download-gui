
// Import libraries
import axios from 'axios';

// Import constants
import animeStore, { Anime } from '.';
import { NEKO_SAMA_ANIMELIST_URL_VOSTFR, NEKO_SAMA_ANIMELIST_URL_VF } from '../../constants';

// extract datas from the anime object
const animeMapper = (anime: Anime): Anime => {
	const { id, title, title_english, title_romanji, url, status, type, url_image, nb_eps } = anime;
	
	const rawEpisodesMatch = nb_eps ? nb_eps.match(/\d+/g): 0;
	const nb_of_episodes = rawEpisodesMatch ? parseInt(rawEpisodesMatch[0]) :0;

	return {
		id,
		title,
		title_english,
		title_romanji,
		url,
		status,
		type,
		url_image,
		nb_eps,
		nb_of_episodes: !isNaN(nb_of_episodes) ? nb_of_episodes: -1
	}
}


const animeSorter = (anime1: Anime, anime2: Anime): number => {
	if (!anime1.title || !anime2.title) return -1;

	return anime1.title.localeCompare(anime2.title);
};

//
// Updaters
//
export const updateVOSTFRAnimeList = async () => {
	animeStore.animeList.vostfr = (await axios.get(NEKO_SAMA_ANIMELIST_URL_VOSTFR)).data
			.map(animeMapper)
			.sort(animeSorter);
}

export const updateVFAnimeList = async () => {
	animeStore.animeList.vf = (await axios.get(NEKO_SAMA_ANIMELIST_URL_VF)).data
			.map(animeMapper)
			.sort(animeSorter);
}
