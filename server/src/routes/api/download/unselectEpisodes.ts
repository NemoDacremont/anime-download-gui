
import { Router } from 'express';

// Middleware
import { json as bodyParserJSON } from 'body-parser';
const JSONParser = bodyParserJSON();

// Store
import { itemsToDownload, downloader } from '../../../stores/download';

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
		downloader.unSelectEpisodes(animeID, version, episodes);
		res.sendStatus(200);
	}
	else {
		next();
	}
});

export default unselectRouter;
