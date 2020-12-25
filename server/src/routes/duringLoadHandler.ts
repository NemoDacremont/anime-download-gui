
import { Router } from 'express';

// Store
import globalStore from '../stores/global';

const duringLoadHandler = Router();

duringLoadHandler.get('*', (req, res, next) => {
	if (globalStore.isServerLoaded) {
		next();
		return;
	}

	res.status(500);
	res.send('Server is loading, please wait');
});

export default duringLoadHandler;
