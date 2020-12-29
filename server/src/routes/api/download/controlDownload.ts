
import { Router } from 'express';

import { json as JSONBodyParse } from 'body-parser';
const JSONParser = JSONBodyParse();

import { downloadAction } from '../../../stores/download';

// TS things
type Action = 'start' | 'stop';
interface IncomingBody {
	action: Action;
}

const controlDownload = Router();


controlDownload.post('/', JSONParser, (req, res, next) => {
	const { action } = req.body as IncomingBody;

	switch(action) {
		case 'start':
			downloadAction.emit('startDownload');
			break;
		case 'stop':
			downloadAction.emit('stopDownload');
			break;
		default:
			next();
			return;
	}

	res.sendStatus(200);
});

export default controlDownload;
