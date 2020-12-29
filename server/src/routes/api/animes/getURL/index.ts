
import { Router } from 'express';

import animeStore from '../../../../stores/animes';
import extractURL from './extractURL';

const getURL = Router();

getURL.get('/getURL/:animeIDRaw/:version/:episodeRaw', (req, res, next) => {
	const { animeIDRaw, version, episodeRaw } = req.params;

	console.log(req.params);

	//	Checking if the version is valid
	if (version !== 'vostfr' && version !== 'vf') next();

	//	Then check if the anime is valid
	else if (
			!parseInt(animeIDRaw) ||
			!parseInt(episodeRaw)
		) next();

	//	We can finally proceed to the extract
	else {
		const animeID = parseInt(animeIDRaw);
		const episode = parseInt(episodeRaw);

		extractURL( animeID, version, episode )
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
