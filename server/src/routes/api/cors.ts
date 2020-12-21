
import cors from 'cors';

const middleWare = cors({
	origin: 'http://localhost:8081'
});

export default middleWare;
