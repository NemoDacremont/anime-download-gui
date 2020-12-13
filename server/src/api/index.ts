
import { Router } from 'express';
import animeRouter from './animes';

const api = Router();

api.use('/animes/', animeRouter);

api.get('*', (req, res) => {
	res.send('api place');
});

export default api;

