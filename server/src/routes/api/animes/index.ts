
import { Router } from 'express';

// Routers
import animeList from './animeList';
import getURL from './getURL';
import episodesRouter from './episodes';

// Store
import animeStore from '../../../stores/animes';

const animesRouter = Router();

animesRouter.use(animeList);
animesRouter.use(getURL);
animesRouter.use('/episodes/', episodesRouter);


/*
*		Route handling single anime downloading
*/
animesRouter.get('/:version/:id', (req, res, next) => {
	if (req.params.version !== "vostfr" && req.params.version !== "vf") {
		next();
		return;
	}

	const animeID = parseInt( req.params.id );
	if (isNaN(animeID)) {
		next();
	}
	else {
		res.json(
			animeStore.animeList[ req.params.version ][ animeID ]
		)
	}
});

export default animesRouter;
