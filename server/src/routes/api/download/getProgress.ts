
import { Router } from 'express';

import { downloader } from '../../../stores/download';

const getProgressesRouter = Router();

getProgressesRouter.get('/', (req, res) => {
	const data = downloader.getParsedProgresses();
	res.json(data);
});

export default getProgressesRouter;
