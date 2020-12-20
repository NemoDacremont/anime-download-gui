
import { Router } from 'express';

import animeStore from '../../../../stores/animes';
import extractURL from './extractURL';

const getURL = Router();

getURL.get('/getURL/:animeIndex/:version/:episode', (req, res, next) => {
	const { animeIndex, version, episode } = req.params;

	console.log(req.params);

	//	Checking if the version is valid
	if (version !== 'vostfr' && version !== 'vf') next();

	//	Then check if the anime is valid
	else if (
			!parseInt(animeIndex) ||
			!parseInt(episode) ||
			parseInt(animeIndex) >= animeStore.animeList[version].length
		) next();

	//	We can finally proceed to the extract
	else {
		extractURL( animeStore.animeList[version][parseInt(animeIndex)], version, parseInt(episode) )
			.then((url) => {
				res.send(url);
			})
			.catch((err: Error) => {
				console.log(err.message);
				res.status(500);
				res.send(`Error 500 - message: ${err.message}`);
			});
	}
});

export default getURL;
