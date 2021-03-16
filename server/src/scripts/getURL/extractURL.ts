
import axios from 'axios';

import { downloader } from '../../stores/download';

import { getSourceFile, Source } from './URLExtractor';



export default function (animeID: number, version: 'vostfr' | 'vf', episode: number): Promise<Source> {
	return new Promise(async (resolve, reject) => {
		const nekoSamaBaseURL = 'https://neko-sama.fr';
		const episodeData = await (downloader.getCachedEpisodes(animeID, version, episode).catch(err => console.log(err)));
		if (!episodeData) throw new Error("No episode data while trying to extractURL");

		const episodeURL = nekoSamaBaseURL + episodeData.url;

		const animePageResponse = await axios.get(episodeURL).catch((err) => console.log(err));
		if (!animePageResponse) throw new Error("Axios get failed with status idk");

		const animePage: string = animePageResponse.data;

		const playersSources = animePage.match(/https?:\/\/((www)|(embed))\.((pstream)|(mystream))\.((net)|(to))\/(\w+\/)?\w+/g);
		console.log("PLAYERS SOURCES:");
		console.table(playersSources);
		if (!playersSources) throw new Error(`The episode you're looking for doesn't look like existing`);

		for (let i=playersSources.length-1 ; i>=0 ; i--) {
			const source = await getSourceFile(playersSources[i]);

			if (source) { resolve(source); return; };
		}

		throw new Error("An error occurred during source url scraping: any extractor succeed to get the source URL.");
	})
}
