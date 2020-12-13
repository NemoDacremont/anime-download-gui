
import { Router } from 'express';
import animeRouter from './animes';

const api = Router();

api.use('/animes/', animeRouter);

api.get('*', (req, res) => {
	res.status(404);
	res.send('404 - Route error');
});

export default api;

