
import { Router } from 'express';
import animeStore from '../../../../stores/animes';

const animeList = Router();

animeList.get('/animelist/:version', (req, res, next) => {
	if (req.params.version === 'vostfr' || req.params.version === 'vf') {
		res.json(animeStore.animeList[ req.params.version ])
	}
	else next();
});

export default animeList;