
import config from './config.json';
import path from 'path';

export const PORT = parseInt(process.env.PORT ?process.env.PORT :'8080');

export const logStyle: 'dev' | 'combined'
	= (process.env.NODE_ENV === 'production') ?'combined' :'dev';

export const chromiumPath = config.chromePath ? config.chromePath : path.join(__dirname, '../chromium/chromium-linux/chrome');
export const outputDir = config.outputDir.replace(/\/$/, '');
