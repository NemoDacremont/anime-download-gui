
import { Router } from 'express';

import animeStore from '../../../stores/animes';
import extractURL from './extractURL';

const getURL = Router();

getURL.get('/getURL/:animeIndex/:version/:episode', (req, res, next) => {
	const { animeIndex, version, episode } = req.params;
	console.log(req.params);
	if (!parseInt(animeIndex) || !parseInt(episode)) next();
	else if (version !== 'vostfr' && version !== 'vf') next();
	else {
		/*
		*		If no version is passed in url, default is vostfr
		*/
		extractURL( animeStore.animeList[version ? version: 'vostfr'][parseInt(animeIndex)], version, parseInt(episode) )
			.then((url) => {
				res.send(url);
			})
			.catch((err) => {
				console.error(err);
				next();
			});
	}
});

export default getURL;
