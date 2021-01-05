
require('dotenv').config();
import express from 'express';

/*
*		Import middlewares
*/
import api from './routes/api';
import clientRouter from './routes/client';
import duringLoadHandler from './routes/duringLoadHandler';
import logger from './logger';
import cors from './cors';

/*
*		Import Config
*/
import { PORT, HOSTNAME } from './constants';
import initScript from './scripts/init';

/*
*		Import Stores
*/

import globalStore from './stores/global';
import socketIOStore from './stores/socketIO';

console.log('Server is loading...');

/*
*		Server Declaration	
*/
const app = express();

/*
*		Midlewares declarations
*/

//	Logger
app.use(logger);

// Cors
if (HOSTNAME !== 'localhost') app.use(cors);

//	Routers
app.use(duringLoadHandler);
app.use('/api/', api);
app.use('/', clientRouter);


/*
*		Start
*/

const httpServer = app.listen(PORT, HOSTNAME,  () => {
	console.log(`\nServer listening on port ${PORT}`);
	console.log('Server loaded, downloading data...');

	initScript(httpServer)
		.then(() => {
			globalStore.isServerLoaded = true;
			console.log('Server is loaded');
		})
		.catch((err) => {
			console.error('An error occurred during data loading, you should verify your internet connection');
			console.log('err:', err?.message);
			console.log('Exit in 5 sec');

			setTimeout(() => {
				process.exit(0);
			}, 5000);
		});
});



