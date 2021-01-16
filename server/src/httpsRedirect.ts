
import express from 'express';
import cors from './cors';

import { HOSTNAME } from './constants';

const app = express();
if (HOSTNAME !== 'localhost') app.use(cors);

app.get('*', (req, res) => {
	console.log(`HTTPS: redirecting ${req.url}`);
	res.redirect('http://' + req.headers.host + req.url);
});

export default app;
