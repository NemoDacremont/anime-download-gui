
import axios from 'axios';
import animeStore from '../stores/animes'; 

async function initScript (): Promise<void> {
	console.log('Server loaded, initializing data...');

	if (process.env["NEKO-SAMA_ANIMELIST-URL_VOSTFR"]) {
		animeStore.animeList.vostfr = (await axios.get(process.env["NEKO-SAMA_ANIMELIST-URL_VOSTFR"])).data
	}

	if (process.env["NEKO-SAMA_ANIMELIST-URL_VF"]) {
		animeStore.animeList.vf = (await axios.get(process.env["NEKO-SAMA_ANIMELIST-URL_VF"])).data
	}

	console.log('Server Loaded.');
}

export default initScript;