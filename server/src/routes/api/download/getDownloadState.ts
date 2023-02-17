
import { Router } from 'express';
import { downloader } from '../../../stores/download';

const getDownloadState = Router();

getDownloadState.get('/', (_, res) => {
	res.send(downloader.state);
});

export default getDownloadState;
