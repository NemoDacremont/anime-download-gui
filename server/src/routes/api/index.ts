
import { Router } from 'express';

//	API Routers
import animeRouter from './animes';
import downloadRouter from './download';
import settingsRouter from './settings';

//	API Router
const api = Router();

api.use('/animes/',  animeRouter);
api.use('/download/', downloadRouter);
api.use("/settings/", settingsRouter);

api.all('*', (req, res) => {
	res.status(400).send('400 - Bad Request');
});

export default api;
