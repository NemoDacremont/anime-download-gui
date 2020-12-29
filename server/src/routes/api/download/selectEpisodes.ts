
import { Router } from 'express';

// Middleware
import { json as bodyParserJSON } from 'body-parser';
const JSONParser = bodyParserJSON();

// Store
import { itemsToDownload } from '../../../stores/download';
import { getAnimeFromID, Version } from '../../../stores/animes';
import extractURL from '../animes/getURL/extractURL';

const selectEpisodesRouter = Router();

selectEpisodesRouter.use(JSONParser);

interface BodyInput {
	animeID?: number;
	version?: Version;
	episodes?: number  | number[];
}

selectEpisodesRouter.post('/', async (req, res, next) => {
	const { animeID, version, episodes } = req.body as BodyInput;
	if (!animeID || !version || !episodes) {
		next();
		return;
	}

	const anime = getAnimeFromID(version, animeID);
	if (!anime) {
		next();
		return;
	}

	// Check all entries and create them if needed
	if (!itemsToDownload.has(animeID)) {
		itemsToDownload.set(animeID, new Map());
	}
	const animeEntry = itemsToDownload.get(animeID);
	if (!animeEntry) return;

	if (!animeEntry.has(version)) {
		animeEntry.set(version, new Set());
	}
	const versionEntry = animeEntry.get(version);
	if (!versionEntry) return;

	if (typeof episodes === 'number') {
		versionEntry.add(episodes);

		res.sendStatus(200);
		return;
	}


	if (Array.isArray(episodes)) {
		for (let episode of episodes) {
			versionEntry.add(episode);
		}
		res.sendStatus(200);
		return;
	}

	next();
});

export default selectEpisodesRouter;
