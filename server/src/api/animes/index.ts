
import { Router } from 'express';
import animeList from './animeList';

const animesRouter = Router();

animesRouter.use(animeList);

export default animesRouter;
