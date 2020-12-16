
import { Router } from 'express';

import animeStore from '../../../stores/animes';
import extractURL from './extractURL';

const getURL = Router();

getURL.get('/:animeIndex/:version', (req, res, next) => {
	const { animeIndex, version } = req.params;
	if (!animeIndex) next();
	else {
		/*
		*		If no version is passed in url, default is vostfr
		*/
		extractURL( animeStore.animeList[version ? version: 'vostfr'][animeIndex] )
			.then((url) => {
				res.send(url);
			})
			.catch(() => {
				next();
			});
	}
});

export default getURL;
