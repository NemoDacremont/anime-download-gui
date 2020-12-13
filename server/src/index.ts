
require('dotenv').config();
import express from 'express';

/*
*		Import middlewares
*/
import api from './api';
import clientRouter from './clientRoutes';
import logger from './logger';

/*
*		Import Config
*/
import { PORT } from './config/constants';
import initScript from './initScript';

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

//	Routers
app.use('/api/', api);
app.use('/', clientRouter);


/*
*		Start
*/

initScript()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`\nServer listening on port ${PORT}`);
		});
	});

