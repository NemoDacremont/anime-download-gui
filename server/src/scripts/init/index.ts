
// Modules
import http from 'http';

import cacheAnimeList from './cacheAnimeList';
import { initPuppeteer } from '../../stores/puppeteer';
import initSocketIOInstance from './initSocketIOInstance';
import initCron, { updateNewsCron } from '../cron';

async function initScript (httpServer: http.Server): Promise<void> {
	await cacheAnimeList();
	await (initPuppeteer()
		.catch((err: Error | null) => {
			console.log('An error occurred, this is probably due to the path for chromium in the config.json file')
			console.log(err?.message);
		}));

	updateNewsCron();

	initSocketIOInstance(httpServer);
	initCron();
}

export default initScript;