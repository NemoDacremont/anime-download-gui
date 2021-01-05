
import { Router } from 'express';
import { json as bodyParserJSON } from 'body-parser';

// local modules
import extractURL from '../animes/getURL/extractURL';
// This is probably useless
//import { isValidURL } from './urlValidator';

// Routers
import download from './downloadScript';
import getSelectedEpisodes from './getSelectedEpisodes';
import selectEpisodes from './selectEpisodes';
import unSelectEpisodes from './unselectEpisodes';
import controlDownload from './controlDownload';
import isDownloadingRouter from './isdownloading';

// Store
import animeStore, { getAnimeFromID, Version } from '../../../stores/animes';

/*
*		Actual Router
*/
const downloadRouter = Router();

/*
*		Middlewares use
*/
const JSONParser = bodyParserJSON()

downloadRouter.use('/getSelectedEpisodes', getSelectedEpisodes);
downloadRouter.use('/selectEpisodes', selectEpisodes);
downloadRouter.use('/unSelectEpisodes', unSelectEpisodes);
downloadRouter.use('/controlDownload', controlDownload);
downloadRouter.use('/isDownloading', isDownloadingRouter);
//downloadRouter.use(JSONParser);

interface IncomingBody {
	animeID?: number,
	version?: Version;
	episodeIndex?: number;
}

downloadRouter.post('/', JSONParser, async (req, res, next) => {
	const { animeID, version, episodeIndex } = req.body as IncomingBody;

	if (
			( !animeID || !version || !episodeIndex ) ||
			( version !== 'vostfr' && version !== 'vf' )
		)
	{
		next();
		return;
	}

	const anime = getAnimeFromID(version, animeID);
	if (!anime) {
		next();
		return;
	}

	if (
		anime.nb_of_episodes !== -1 &&
		episodeIndex > anime.nb_of_episodes
	) {
		console.log(anime.nb_of_episodes)
		res.status(400);
		res.send("400 - Bad Request: The episode passed doesn't exist");
	}
	else {
		extractURL( animeID, version, episodeIndex )
			.then((url) => {
				if (!url || typeof url !== 'string') throw new Error('URL is null: api/download');
				download(url)
					.then((success) => {
						if (!success) res.status(530);
						res.send(
							success
							? 'Download has been succeeded'
							: 'An error occurred'
						);
					})
					.catch((err: Error) => {
						res.status(500);
						res.send(	`Error 500 - Internal Server Error: ${err.message} \
											State: downloading file`);
					});
			})
			.catch((err: Error) => {
				res.status(500);
				res.send(	`Error 500 - Internal Server Error: ${err.message} \
									State: extracting source URL`);
			});
	}
});

export default downloadRouter;
