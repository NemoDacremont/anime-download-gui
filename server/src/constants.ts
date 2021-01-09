
import config from './config.json';
import path from 'path';

// other things
export const PORT = parseInt(process.env.PORT ?process.env.PORT :'8080');
export const HOSTNAME = config.openOnLocalNetwork ? '0.0.0.0': 'localhost';

// things
export const logStyle: 'dev' | 'combined'
	= (process.env.NODE_ENV === 'production') ?'combined' :'dev';

// chromium path ..;/;.
export const chromiumPath = config.chromePath ? config.chromePath : path.join(__dirname, '../chromium/chromium-linux/chrome');

// Out dir, is using /home/{USER}/ as alias to '~'
if (!process.env.HOME) throw new Error("process.env.HOME doesn't exist");
export const outputDir = config.outputDir.replace(/\/$/, '').replace('~', process.env.HOME);


// NEKO-SAMA URLs

export const NEKO_SAMA_ANIMELIST_URL_VOSTFR = "https://neko-sama.fr/animes-search-vostfr.json";
export const NEKO_SAMA_ANIMELIST_URL_VF = "https://neko-sama.fr/animes-search-vf.json";
export const NEKO_SAMA_BASE_URL = "https://neko-sama.fr/"