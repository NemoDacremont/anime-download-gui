
import config from './config.json';
import path from 'path';

export const PORT = parseInt(process.env.PORT ?process.env.PORT :'8080');

export const logStyle: 'dev' | 'combined'
	= (process.env.NODE_ENV === 'production') ?'combined' :'dev';

export const chromiumPath = config.chromePath ? config.chromePath : path.join(__dirname, '../chromium/chromium-linux/chrome');

if (!process.env.HOME) throw new Error("process.env.HOME doesn't exist");
export const outputDir = config.outputDir.replace(/\/$/, '').replace('~', process.env.HOME);
