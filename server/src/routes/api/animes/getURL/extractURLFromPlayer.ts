
import catchPStreamM3u8 from './catchPStreamM3U8';
import fetchM3u8 from './fetchM3U8';
import { M3u8JSON } from './extractURL';

import { page as pageStored, createPage } from '../../../../stores/puppeteer';

export default function (playerURL: string): Promise<string | M3u8JSON | null> {
	return new Promise(async (resolve) => {
		// If pageStored is null, this means puppeteer hasn't been initialized
		if (!pageStored) {
			resolve(null);
			return;
		}
		// Recreate the page if it has been closed
		const page = pageStored.isClosed() ? await createPage(): pageStored;

		let /*noBlob = false, */withBlob = false, noSource = false, noVideoSrc = false;

		/*
		*		Trying to scrap blob things through weird and complicated things but it works!
		*/
		page.on('response', async (response) => {
			// This will only support pstream site for and for security
			const manifestURL = await catchPStreamM3u8(response);
			if (!manifestURL) return;

			const manifest = await fetchM3u8(manifestURL, page);
			if (!manifest) return;

			withBlob = true;
			resolve(manifest);
		});

		/*
		*		End of blob thing
		*/

		// 	Request the player page
		await page.goto(playerURL);

		/*
		*		Scraping video's src attribute
		*		if it exist, return. else try source tag
		*/
	
		const videoSrc = await (page.$eval('video', (el) => el.getAttribute('src')).catch((err: Error) => console.log(err.message)));
		if (videoSrc && typeof videoSrc === 'string' && !videoSrc.includes('blob')) {
			await page.close();
			resolve(videoSrc);
		}
		noVideoSrc = true;
		console.log('no video src');
	

		/*
		*		Scraping source tag src attribute
		*		if exist, return. else blob
		*/

		const sourceSrc = await (page.$eval('source', (el) => el.getAttribute('src')).catch((err: Error) => console.log(err.message)));
		if (sourceSrc && !sourceSrc.includes('blob')) {
			await page.close();
			resolve(sourceSrc);
		}
		noSource = true;
		console.log('no source tag');


		/*
		*		Time out and close the page
		*/

		setTimeout(async () => {
			await page.close();
			if (!withBlob) {
				console.log('no blob')
				resolve(null);
			}
		}, 10000);
	});
}
