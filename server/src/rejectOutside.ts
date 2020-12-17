
import { Router } from 'express';

const rejectFromOutside = Router();

rejectFromOutside.get('*', (req, res, next) => {
	console.log(req.get('host'));
	next();
});

export default rejectFromOutside;
