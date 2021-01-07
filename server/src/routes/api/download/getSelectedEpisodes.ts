
import { Router } from 'express';
import { Version } from '../../../stores/animes';

import { downloader } from '../../../stores/download';

const router = Router();

/*
*		The store is using Map objects
*		This means we have to parse it into JSON
*/


router.get('/:animeID?/:version?', (req, res) => {
	const { animeID, version } = req.params;
	const output = downloader.getParsedDownloadList();

	const isVersionValid = ['vostfr', 'vf'].includes(version);
	const isAnimeIDValid = !isNaN(parseInt(animeID));

	// Test if the params are valid
	if (!isAnimeIDValid) { res.json(output); return; }

	// Test if asked data exist, otherwise send the entire object
	const parsedAnimeID = parseInt(animeID);
	const animeEntry = output[parsedAnimeID];
	if (!animeEntry) { res.json({}); return; }

	// This is supposed to trigger when version is undefined because it is optional
	if (!isVersionValid) { res.json(animeEntry); return; }

	if (animeEntry[version as Version]) res.json(animeEntry[version as Version]);
	else res.json([]);
});

export default router;
