
import { Router } from 'express';

// Routers
import animeList from './animeList';
import getURL from './getURL';
import episodesRouter from './episodes';
import getNewsRouter from './getNews';

// Store
import { getAnimeFromID } from '../../../stores/animes';

// animeRouter
const animesRouter = Router();


// Middlewares
animesRouter.use(animeList);
animesRouter.use(getURL);
animesRouter.use('/episodes/', episodesRouter);
animesRouter.use('/getNews', getNewsRouter);


/*
*		Route handling single anime
*/
animesRouter.get('/:version/:id', (req, res, next) => {
	if (req.params.version !== "vostfr" && req.params.version !== "vf") {
		next();
		return;
	}

	const animeID = parseInt( req.params.id ), version = req.params.version;
	if (isNaN(animeID)) {
		next();
	}
	else {
		res.json(
			getAnimeFromID(version, animeID)
		)
	}
});

export default animesRouter;
