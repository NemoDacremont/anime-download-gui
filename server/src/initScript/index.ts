
import cacheAnimeList from './cacheAnimeList';

async function initScript (): Promise<void> {
	await cacheAnimeList();
}

export default initScript;