
import { Router } from 'express';

// Middleware
import { json as bodyParserJSON } from 'body-parser';
const JSONParser = bodyParserJSON();

// Store
import { itemsToDownload } from '../../../stores/download';

// Types

import { Version } from '../../../stores/animes';

interface incomingBody {
	animeID?: number;
	version?: Version;
	episodes?: number  | number[];
}

// Router

const unselectRouter = Router();

unselectRouter.post('/', JSONParser, (req, res, next) => {
	const { animeID, version, episodes } = req.body as incomingBody;

	if (animeID) {
		// if no version is passed, unselect the entire anime
		const animeEntry = itemsToDownload.get(animeID);
		if (!animeEntry) {
			res.sendStatus(200);
			return;
		}

		if (!version) {
			itemsToDownload.delete(animeID);
		}
		// If a version is passed, 
		else {
			const versionEntry = animeEntry.get(version);
			if (!versionEntry) {
				res.sendStatus(200);
				return;
			}

			if (episodes) {
				if (typeof episodes === 'number') {
					const episodeEntry = versionEntry.get(episodes);
					if (episodeEntry) {
						versionEntry.delete(episodes);
					}
				}
				else if (Array.isArray(episodes)) {
					episodes.forEach((episode) => {
						const episodeEntry = versionEntry.get(episode);
						if (episodeEntry) {
							versionEntry.delete(episode);
						}
					});
				}

				// If there isn't episode selected anymore, delete the highest entry
				if (versionEntry.size === 0) {
					if (animeEntry.size === 1) {
						itemsToDownload.delete(animeID);
					}
					else if (animeEntry.get(version === 'vostfr' ? 'vf': 'vostfr')?.size === 0) {
						itemsToDownload.delete(animeID);
					}
					else {
						animeEntry.delete(version)
					}
				}

			}
		}

		res.sendStatus(200);
		return;
	}
	else {
		next();
	}
});

export default unselectRouter;
