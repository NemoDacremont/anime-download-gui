
import { Router } from 'express';
import animeStore from '../../../stores/animes';

const animeList = Router();

animeList.get('/animelist/', (req, res, next) => {
	if (req.query && (req.query.version === 'vostfr' || req.query.version === 'vf')) {
		res.json(animeStore.animeList[ req.query.version ])
	}
	else next();
});

export default animeList;