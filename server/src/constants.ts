
//import config from './config.json';
//import path from 'path';

import { join } from 'path';
import { readJSON } from './utils/readJSON';

export const configPath = join(__dirname, 'config.json');
export const config = readJSON(configPath);

// other things
export const port = config.port || 8080;
export const HOSTNAME = config.openOnLocalNetwork ? '0.0.0.0': 'localhost';

export const { openInBrowserOnLoad, openOnLocalNetwork, ffmpegPath } = config;

// things
export const logStyle: 'dev' | 'combined'
	= (process.env.NODE_ENV === 'production') ?'combined' :'dev';

// Out dir, is using /home/{USER}/ as alias to '~'
if (!process.env.HOME) throw new Error("process.env.HOME doesn't exist");
export let outputDir = config.outputDir.replace(/\/$/, '').replace('~', process.env.HOME);


// NEKO-SAMA URLs

export const NEKO_SAMA_ANIMELIST_URL_VOSTFR = "https://neko-sama.fr/animes-search-vostfr.json";
export const NEKO_SAMA_ANIMELIST_URL_VF = "https://neko-sama.fr/animes-search-vf.json";
export const NEKO_SAMA_BASE_URL = "https://neko-sama.fr/"
