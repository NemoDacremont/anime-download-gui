
import express from 'express';

import api from './api';
import logger from './logger';
import { PORT } from './config/constants';

const app = express();

/*
*		Midlewares declarations
*/

app.use(logger);
app.use('/api/', api);

/*
*		Routes
*/

app.get('*', (req, res) => {
	res.send('hello World!');
});


app.listen(PORT, () => {
	console.log(`Listenning on port ${PORT}`);
});
