
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
		[version in Version]?: number[];
	}
}


router.get('/', (req, res) => {
	const output: Output = {};

	itemsToDownload.forEach((versions, animeID) => {

		output[animeID] = {};
		const animeEntry = output[animeID];
		versions.forEach((episodes, version) => {
			animeEntry[version] = [...episodes];
		});
	});

	res.json(output);
});

export default router;
