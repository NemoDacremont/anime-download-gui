
import { Router } from 'express';

// Middleware
import { json as bodyParserJSON } from 'body-parser';
const JSONParser = bodyParserJSON();

// Store
import { itemsToDownload, ItemsToDownload } from '../../../stores/download';
import { Version } from '../../../stores/animes';

const selectEpisodesRouter = Router();

selectEpisodesRouter.use(JSONParser);

interface BodyInput {
	animeID?: number;
	version?: Version;
	episodes?: number  | number[];
}

selectEpisodesRouter.post('/', (req, res, next) => {
	const { animeID, version, episodes } = req.body as BodyInput;
	if (!animeID || !version || !episodes) {
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
		animeEntry.set(version, new Map());
	}
	const versionEntry = animeEntry.get(version);
	if (!versionEntry) return;

	if (typeof episodes === 'number') {
		versionEntry.set(episodes, 'bonjour');

		res.sendStatus(200);
		return;
	}


	if (Array.isArray(episodes)) {
		episodes.forEach((episodes) => {
			versionEntry.set(episodes, 'fkjezlkj');
		});
		res.sendStatus(200);
		return;
	}

	next();
});

export default selectEpisodesRouter;
