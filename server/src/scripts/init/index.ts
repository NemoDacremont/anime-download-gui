
import cacheAnimeList from './cacheAnimeList';
import { initPuppeteer } from '../../stores/puppeteer';

async function initScript (): Promise<void> {
	await cacheAnimeList();
	await initPuppeteer();
}

export default initScript;