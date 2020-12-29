
import axios from 'axios';

import extractURLFromPlayer from './extractURLFromPlayer';
import { downloader } from '../../../../stores/download';

export default async function (animeID: number, version: 'vostfr' | 'vf', episode: number): Promise<string | null> {

	const nekoSamaBaseURL = 'https://neko-sama.fr';
	const episodeData = await downloader.getCachedEpisodes(animeID, version, episode);
	if (!episodeData) return null;

	const episodeURL = nekoSamaBaseURL + episodeData.url;

	const animePage: string = (await axios.get(episodeURL)).data;


	const playersSources = animePage.match(/https?:\/\/((www)|(embed))\.((pstream)|(mystream))\.((net)|(to))\/(\w+\/)?\w+/g);

	if (!playersSources) throw new Error(`The episode you're looking for doesn't look like existing`);

	for (let i=playersSources.length-1 ; i>0 ; i--) {
		const url = await extractURLFromPlayer(playersSources[i]);
		if (typeof url === "string") return url;
	}

	// Blob support

	throw new Error("Sadly, we blob download isn't supported yet");
}
