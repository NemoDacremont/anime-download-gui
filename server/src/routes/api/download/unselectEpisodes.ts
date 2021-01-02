
import { Router } from 'express';

// Middleware
import { json as bodyParserJSON } from 'body-parser';
const JSONParser = bodyParserJSON();

// Store
import { downloader } from '../../../stores/download';
import socketIOStore from '../../../stores/socketIO';

// Types

import { Version } from '../../../stores/animes';

interface incomingBody {
	animeID?: string | number;
	version?: Version;
	episodes?: number  | number[];
}

// Router

const unselectRouter = Router();

unselectRouter.post('/', JSONParser, (req, res, next) => {
	const { animeID: rawAnimeID, version, episodes } = req.body as incomingBody;

	const animeID = typeof rawAnimeID === 'string' ? parseInt(rawAnimeID): rawAnimeID;
	if (animeID) {
		downloader.unSelectEpisodes(animeID, version, episodes);
		socketIOStore.socketIOInstance?.emit('updateSelectedAnime');
		res.sendStatus(200);
	}
	else {
		next();
	}
});

export default unselectRouter;
