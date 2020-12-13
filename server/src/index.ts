
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

app.listen(PORT, () => {
	console.log(`Listenning on port ${PORT}`);
});
