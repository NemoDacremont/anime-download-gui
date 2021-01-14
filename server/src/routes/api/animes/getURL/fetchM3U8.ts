
import { Page } from 'puppeteer-core';
import { m3u8Parser } from 'mpd-m3u8-to-json';
import { M3u8JSON } from './extractURL';

export default async function (url: string, page: Page): Promise<M3u8JSON | null> {
	if (!page) return null;

	const manifest2 = await page?.evaluate(async (url) => {
		return await (await fetch(url)).text();
	}, url);

	if (manifest2 && typeof manifest2 === 'string') {
		const output = m3u8Parser(manifest2, 'fake url');
		return output;
	}
	return null;
}
