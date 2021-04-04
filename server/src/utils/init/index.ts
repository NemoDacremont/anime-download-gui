
// Modules
import http from 'http';

import cacheAnimeList from './cacheAnimeList';
import initSocketIOInstance from './initSocketIOInstance';
import initCron, { updateNewsCron } from '../cron';

async function initScript (httpServer: http.Server): Promise<void> {
	await cacheAnimeList();
	updateNewsCron();

	initSocketIOInstance(httpServer);
	initCron();
}

export default initScript;