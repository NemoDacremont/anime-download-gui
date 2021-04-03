
import { Router } from 'express';

import extractURL from '../../../../utils/getURL/extractURL';

// types
import { Version } from '../../../../stores/animes';

const getURL = Router();

getURL.get('/getURL/:animeIDRaw/:version/:episodeRaw', (req, res, next) => {
	const { animeIDRaw, version, episodeRaw } = req.params;

	console.log(req.params);

		const areParamsValid = !isNaN(parseInt(animeIDRaw)) && !isNaN(parseInt(episodeRaw));

	//	Checking if the version is valid
	if (['vostfr', 'vf'].includes(version)) next();

	//	Then check if the anime is valid
	else if (!areParamsValid) next();

	//	We can finally proceed to the extract
	else {
		const animeID = parseInt(animeIDRaw);
		const episode = parseInt(episodeRaw);

		extractURL( animeID, version as Version, episode )
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
