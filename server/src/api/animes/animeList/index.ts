
import { Router } from 'express';

const animeList = Router();

animeList.get('/animelist/', (req, res) => {
	res.send('animelist');
});

export default animeList;