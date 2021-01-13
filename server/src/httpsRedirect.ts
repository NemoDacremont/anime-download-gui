
import express from 'express';
import cors from './cors';

const app = express();
app.use(cors);

app.get('*', (req, res) => {
	res.redirect('http://' + req.headers.host + req.url);
});

export default app;
