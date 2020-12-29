
//import axios from 'axios';
import { browser, pages } from '../../../../stores/puppeteer';

export default function (playerURL: string): Promise<string | null> {
	return new Promise(async (resolve, reject) => {
		//const playerPage = (await axios.get(playerURL)).data;

		const pageIndex = pages.push(await browser.newPage());
		const page = pages[pageIndex-1];

		/*
		// wanted to reject non same-origin request but it interfere
		// with mystream support, keep it here if I finally find a
		// way to remove trackers
		page.on('request', (request) => {
			const url = new URL(page.url());
			const sameOriginReGex = new RegExp('^', url.origin);
			console.log(sameOriginReGex);

			if (sameOriginReGex.test(request.url())) {
				request.continue();
			}
			else request.continue();
		});*/

		await page.goto(playerURL);

		/*
		*		Scraping video's src attribute
		*		if it exist, return. else try source tag
		*/
		const videoSrc = await page.$eval('video', (el) => el.getAttribute('src'));
		if (videoSrc && typeof videoSrc === 'string') {
			page.close();
			resolve(videoSrc);
		}

		/*
		*		Scraping source tag src attribute
		*		if exist, return. else blob
		*/

		const sourceSrc = await page.$eval('source', (el) => el.getAttribute('src'));
		if (sourceSrc) {
			page.close();
			resolve(sourceSrc);
		}

		/*
		*		Blob scraping
		*/

		page.on('response', async (response) => {
			// This will only support pstream site for and for security
			const manifestRegex = /^https:\/\/www\.pstream\.net\/\w\/\w*?\.m3u8/i;
			if (manifestRegex.test(response.url())) {
				console.log(await response.text());
				page.close();
				resolve(null);
			}
		});

		// maybe latter, this means we can't get p-streaming file source.
	});
}
