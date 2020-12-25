
import { Router } from 'express';
import animeRouter from './animes';
import downloadRouter from './download';

const api = Router();

api.use('/animes/',  animeRouter);

api.use('/download/', downloadRouter);

api.all('*', (req, res) => {
	res.status(400).send('400 - Bad Request');
});

export default api;
