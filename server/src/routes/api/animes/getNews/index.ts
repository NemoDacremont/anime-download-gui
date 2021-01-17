
import { Router } from 'express';

//
import animeStore from '../../../../stores/animes';

const getNewsRouter = Router();

getNewsRouter.get('/', (req, res) => {
	res.json(animeStore.news);
});

export default getNewsRouter;
