
require('dotenv').config();
import express from 'express';
import open from 'open';

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
import initScript from './utils/init';

/*
*		Import Stores
*/

import globalStore from './stores/global';

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

try {
	const httpServer = app.listen(PORT, HOSTNAME,  () => {
		console.log(`\nServer listening on port ${PORT}`);
		console.log('Server loaded, downloading data...');

		initScript(httpServer)
			.then(() => {
				globalStore.isServerLoaded = true;
				console.log('Server is loaded');
			})
			.catch((err: Error | string) => {
				console.error('An error occurred during data loading, you should verify your internet connection');
				console.log('err:', err);
				console.log('Exit in 5 sec');

				setTimeout(() => {
					process.exit(0);
				}, 5000);
			});
	});
}
catch (err) {
	console.error(err);
	console.log("The program is already using, opening in browser");
	open(`http://localhost:${PORT}/`);
	process.exit(0);
}

// HTTPS things
/*
import httpsRedirect from './httpsRedirect';
httpsRedirect.listen(4433, HOSTNAME, () => {
	console.log(`HTTP redirect has been set up on port 4433`);
});
*/

// Uncaught Error, in order to catch the Error: connect ECONNREFUSED 127.0.0.1:443
// Let's hope this works :( The issue will be the process won't restart
process.on('uncaughtException', (err) => {
	console.error("UNCAUGHT EXCEPTION");
	console.error(err);
	console.error('THEN THE PROCESS STOPS');
	process.exit(0);
});