
import axios from 'axios';

import { downloader } from '../../stores/download';

import { getSourceFile, Source } from './URLExtractor';

const playerSourcesRegExps: RegExp[] = [
	/https?:\/\/veestream\.net\/(\w+\/)+\w+/,
	/https?:\/\/www\.pstream\.net\/(\w+\/)?\w+/,
	/https?:\/\/embed\.mystream\.to\/(\w+\/)?\w+/,
]

export default function (animeID: number, version: 'vostfr' | 'vf', episode: number): Promise<Source> {
	return new Promise(async (resolve, reject) => {
		const nekoSamaBaseURL = 'https://neko-sama.fr';
		const episodeData = await (downloader.getCachedEpisodes(animeID, version, episode).catch(err => console.log(err)));
		if (!episodeData) { reject(new Error("No episode data while trying to extractURL")); return; }

		const episodeURL = nekoSamaBaseURL + episodeData.url;

		const animePageResponse = await axios.get(episodeURL).catch((err) => console.log(err));
		if (!animePageResponse) { reject(new Error("Axios get failed with status idk")); return; }

		const animePage: string = animePageResponse.data;

		// On extrait toutes les url des players
		const playersSources: string[] = []
		for (let i=0 ; i<playerSourcesRegExps.length ; i++) {
			const playerSourceRegExp = playerSourcesRegExps[i]
			const playerSource = animePage.match(playerSourceRegExp)

			if (playerSource) {
				console.log("player trouvé:", playerSource[0])
				playersSources.push(playerSource[0])
			}
		}

		console.log("PLAYERS SOURCES:");
		console.table(playersSources);
		if (!playersSources) throw new Error(`The episode you're looking for doesn't look like existing`);

		// On teste si on peut extraire la video des players
		for (let i=0 ; i<playersSources.length ; i++) {
			const source = await getSourceFile(playersSources[i]);

			if (source) { resolve(source); return; };
		}

		reject(new Error("An error occurred during source url scraping: any extractor succeed to get the source URL."));
	})
}
