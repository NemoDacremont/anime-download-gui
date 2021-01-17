
import cron from 'node-cron';

//	Stores
import { updateNews } from '../../stores/animes';

//
import getNews from '../getNews';
import updateAnimeListCache from '../init/cacheAnimeList';


export async function updateNewsCron (): Promise<void> {
	await (getNews().then((newNews) => {
		updateNews(newNews);
	}).catch((err) => {
		console.log(err);
	}))
}

export default function setUpCron () {
	// Running every 4 hours
	cron.schedule('0 0,4,8,12,16,20 * * *', async () => {
		console.log('Cron Started');
		await updateNewsCron();
		await updateAnimeListCache();
		console.log('Cron finished');
	});
}
