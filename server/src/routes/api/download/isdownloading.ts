
import { Router } from 'express';

import { downloader } from '../../../stores/download';

const isDownloadingRouter = Router();

isDownloadingRouter.get('/', (req, res) => {
	res.send(downloader.isDownloading);
});

export default isDownloadingRouter;
