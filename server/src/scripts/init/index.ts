
// Modules
import http from 'http';

import cacheAnimeList from './cacheAnimeList';
import { initPuppeteer } from '../../stores/puppeteer';
import initSocketIOInstance from './initSocketIOInstance';

async function initScript (httpServer: http.Server): Promise<void> {
	await cacheAnimeList();
	await initPuppeteer();

	initSocketIOInstance(httpServer);
}

export default initScript;