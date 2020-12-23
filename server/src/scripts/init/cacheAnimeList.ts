
import axios from 'axios';
import animeStore, { Anime } from '../../stores/animes';

const animeMapper = (anime: Anime): Anime => {
	const { id, title, title_english, title_romanji, url, status, url_image, nb_eps } = anime;
	
	const rawEpisodesMatch = nb_eps ? nb_eps.match(/\d+/g): 0;
	const nb_of_episodes = rawEpisodesMatch ? parseInt(rawEpisodesMatch[0]) :0;

	return {
		id,
		title,
		title_english,
		title_romanji,
		url,
		status,
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
