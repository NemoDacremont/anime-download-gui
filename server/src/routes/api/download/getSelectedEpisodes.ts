
import { Router } from 'express';

import { Version } from '../../../stores/animes';
import { itemsToDownload } from '../../../stores/download';

const router = Router();

/*
*		The store is using Map objects
*		This means we have to parse it into JSON
*/

interface Output {
	[animeID: number]: {
		[version in Version]?: {
			[episodeIndex: number]: string;
		}
	}
}


router.get('/', (req, res) => {
	const output: Output = {};

	itemsToDownload.forEach((versions, animeID) => {

		output[animeID] = {};
		const animeEntry = output[animeID];
		versions.forEach((episodes, version) => {

			animeEntry[version] = {};
			const versionEntry = animeEntry[version];
			episodes.forEach((episodeURL, episodeIndex) => {

				if (versionEntry) {
					versionEntry[episodeIndex] = episodeURL;
				}
			});
		});
	});

	res.json(output);
});

export default router;
