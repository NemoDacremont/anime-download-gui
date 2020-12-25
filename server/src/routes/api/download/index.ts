
import { Router } from 'express';
import { json as bodyParserJSON } from 'body-parser';

// local modules
import { isValidURL } from './urlValidator';

// Routers
import extractURL from '../animes/getURL/extractURL';
import download from './downloadScript';
import getSelectedEpisodes from './getSelectedEpisodes';
import selectEpisodes from './selectEpisodes';
import unSelectEpisodes from './unselectEpisodes';

// Store
import animeStore from '../../../stores/animes';

const JSONParser = bodyParserJSON()

/*
*		Actual Router
*/
const downloadRouter = Router();

/*
*		Middlewares use
*/

downloadRouter.use('/getSelectedEpisodes', getSelectedEpisodes);
downloadRouter.use('/selectEpisodes', selectEpisodes);
downloadRouter.use('/unSelectEpisodes', unSelectEpisodes);
//downloadRouter.use(JSONParser);

downloadRouter.post('/', JSONParser, async (req, res, next) => {
	const {
					animeIndex,
					version,
					episodeIndex
				}: {
					animeIndex: number,
					version: 'vostfr' | 'vf';
					episodeIndex: number;
				} = req.body;

	if (
			( !animeIndex || !version || !episodeIndex ) ||
			( version !== 'vostfr' && version !== 'vf' )
		)
	{
		next();
	}

	else if (
		animeIndex > animeStore.animeList[version].length
	) {
		res.status(400);
		res.send("400 - Bad Request: The anime passed doesn't exist");
	}

	else if (
		animeStore.animeList[version][ animeIndex ].nb_of_episodes !== -1 &&
		episodeIndex > animeStore.animeList[version][ animeIndex ].nb_of_episodes
	) {
		console.log(animeStore.animeList[version][animeIndex].nb_of_episodes)
		res.status(400);
		res.send("400 - Bad Request: The episode passed doesn't exist");
	}

	else {
		const parsedAnimeIndex = animeIndex;
		const parsedEpisodeIndex = episodeIndex;
		const anime = animeStore.animeList[ version ][ parsedAnimeIndex ];

		extractURL( anime, version, parsedEpisodeIndex )
			.then((url) => {
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

/*downloadRouter.get('/:base64URL', (req, res, next) => {
	const url = Buffer.from(req.params.base64URL, 'base64').toString('utf-8');
	console.log(isValidURL(url));

	if (!isValidURL(url)) {
		res.status(400);
		res.send('400 - Bad Request, Something went wrong, if you were using the software as normally and it persist you may need to contact the admin');
	}
	else {
		console.log('url valid:', url);

		download(url)
			.then((value) => {
				console.log(value);
				res.send( value );
			})
			.catch((err: Error) => {
				res.status(500);
				res.send(`Error 500 - Internal Server Error: ${err.message}`);
			});
		}
});*/

export default downloadRouter;
