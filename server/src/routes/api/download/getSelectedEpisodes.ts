
import { Router } from 'express';

import { downloader } from '../../../stores/download';

const router = Router();

/*
*		The store is using Map objects
*		This means we have to parse it into JSON
*/


router.get('/', (req, res) => {
	const output = downloader.getParsedDownloadList();

	res.json(output);
});

export default router;
