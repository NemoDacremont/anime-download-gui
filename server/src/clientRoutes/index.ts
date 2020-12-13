
import { Router } from 'express';

const clientRouter = Router();

clientRouter.get('/', (req, res) => {
	res.send('home');
});

clientRouter.get('*', (req, res) => {
	res.status(404);
	res.send('File not found');
});

export default clientRouter;
