
import { Router } from 'express';
import animeRouter from './animes';
import downloadRouter from './download';

import cors from './cors';

const api = Router();

api.use(cors);
api.use('/animes/',  animeRouter);

api.use('/download/', downloadRouter);

api.get('*', (req, res) => {
	res.status(404);
	res.send('404 - Route error');
});

export default api;

