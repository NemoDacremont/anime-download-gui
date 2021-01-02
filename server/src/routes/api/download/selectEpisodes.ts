
import { Router } from 'express';

// Middleware
import { json as bodyParserJSON } from 'body-parser';
const JSONParser = bodyParserJSON();

// Store
import { downloader } from '../../../stores/download';
import { getAnimeFromID, Version } from '../../../stores/animes';
import socketIOStore from '../../../stores/socketIO';

const selectEpisodesRouter = Router();

selectEpisodesRouter.use(JSONParser);

interface BodyInput {
	animeID?: number;
	version?: Version;
	episodes?: number  | number[];
}

const onlyContainNumber = (arr: any[]): boolean => {
	for (let i=0 ; i<arr.length ; i++) {
		if (typeof arr[i] !== 'number') return false;
	}
	return true;
}

selectEpisodesRouter.post('/', async (req, res, next) => {
	const { animeID, version, episodes } = req.body as BodyInput;
	
	const isAnimeIDValid = typeof animeID === 'number';
	const isVersionValid = version && (['vostfr', 'fr'].includes(version));
	const isEpisodeValid = Array.isArray(episodes) && onlyContainNumber(episodes) || typeof episodes === 'number';

	if (!isAnimeIDValid || !isVersionValid || !isEpisodeValid) {
		next();
		return;
	}

	// Force types because ts doesn't like my test
	// test if the animeID is linked to an anime
	const anime = getAnimeFromID(version as Version, animeID as number);
	if (!anime) next();
	else {
		// Force types for same reason
		downloader.selectEpisode(animeID as number, version as Version, episodes as number | number[]);
		console.log('socketio: update selected anime');
		socketIOStore.socketIOInstance?.emit('updateSelectedAnime');
		res.sendStatus(200);
	}
});

export default selectEpisodesRouter;
