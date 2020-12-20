
import path from 'path';
import { Router, static as expressStatic } from 'express';
import history from 'connect-history-api-fallback';

const clientRouter = Router();

const historyHandler = history({
	verbose: true
});

clientRouter.use(historyHandler);
clientRouter.use(
	'/',
	expressStatic( path.join(__dirname, '../../client/') )
);

clientRouter.get('*', (req, res) => {
	res.sendFile('/index.html');
});

export default clientRouter;
