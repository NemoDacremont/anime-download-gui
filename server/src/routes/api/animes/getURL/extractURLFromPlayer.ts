
//import axios from 'axios';
import { browser, pages } from '../../../../stores/puppeteer';

export default async function (playerURL: string): Promise<string | null> {
	//const playerPage = (await axios.get(playerURL)).data;

	const pageIndex = pages.push(await browser.newPage());
	const page = pages[pageIndex-1];

	await page.goto(playerURL);

	/*
	*		Scraping video's src attribute
	*		if it exist, return. else try source tag
	*/
	console.log(await page.$eval('video', (el) => el.innerHTML));

	const videoSrc = await page.$eval('video', (el) => el.getAttribute('src'));
	if (typeof videoSrc === 'string' && videoSrc) {
		await page.close();
		return videoSrc;
	}

	console.log(videoSrc);
	console.log(videoSrc);
	console.log(videoSrc);
	console.log(videoSrc);

	/*
	*		Scraping source tag src attribute
	*		if exist, return. else blob
	*/

	const sourceSrc = await page.$eval('source', (el) => el.getAttribute('src'));
	console.log(sourceSrc);
	console.log(sourceSrc);
	console.log(sourceSrc);
	if (sourceSrc) {
		await page.close();
		return sourceSrc;
	}

	/*
	*		Blob scraping
	*/

	// maybe latter, this means we can't get p-streaming file source.

	await page.close();
	return sourceSrc;
}
