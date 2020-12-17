
import axios from 'axios';
import animeStore, { Anime } from '../stores/animes';

const animeMapper = (anime: Anime): Anime => {
	const { id, title, url, status, url_image, nb_eps } = anime;

	return {
		id,
		title,
		url,
		status,
		url_image,
		nb_eps
	}
}

const animeSorter = (anime1: Anime, anime2: Anime): number => {
	if (!anime1.title || !anime2.title) return -1;

	return anime1.title.localeCompare(anime2.title);
};

//
export default async function (): Promise<void> {
	if (process.env["NEKO-SAMA_ANIMELIST-URL_VOSTFR"]) {
		animeStore.animeList.vostfr = (await axios.get(process.env["NEKO-SAMA_ANIMELIST-URL_VOSTFR"])).data
			.map(animeMapper)
			.sort(animeSorter);
	}
	if (process.env["NEKO-SAMA_ANIMELIST-URL_VF"]) {
		animeStore.animeList.vf = (await axios.get(process.env["NEKO-SAMA_ANIMELIST-URL_VF"])).data
			.map(animeMapper)
			.sort(animeSorter);
	}
}
