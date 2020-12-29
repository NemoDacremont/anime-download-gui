
import { m3u8Parser } from 'mpd-m3u8-to-json';
import { M3u8JSON } from './extractURL';

//import axios from 'axios';
import { browser, page } from '../../../../stores/puppeteer';

export default function (playerURL: string): Promise<string | M3u8JSON | null> {
	return new Promise(async (resolve, reject) => {
		//const playerPage = (await axios.get(playerURL)).data;

		//const pageIndex = pages.push(await browser.newPage());
		//const page = pages[pageIndex-1];
		if (!page) return;

		let noBlob = false, noSource = false;

		page.on('response', async (response) => {
			// This will only support pstream site for and for security
			const manifestRegex = /^https:\/\/www\.pstream\.net\/\w\/\w*?\.m3u8/i;
			if (manifestRegex.test(response.url())) {

				const manifests = await response.text();

				const manifestRegex = /^https:\/\/www\.pstream\.net\/h\/\d+\/\w*?\.m3u8\?expires=\d+&signature=\w+/m;
				const bestManifests = manifests.match(manifestRegex)

				const bestManifestURL = bestManifests ? bestManifests[0]: null;

				if (bestManifestURL) {
					const manifest2 = await page?.evaluate(async (url) => {
						return await (await fetch(url)).text();
					}, bestManifestURL);

					if (manifest2 && typeof manifest2 === 'string') {
						const output = m3u8Parser(manifest2, 'fake url');
						resolve(output);
					}
				}
				else {
					noBlob = true;
					if (noSource) {
						resolve(null);
					}
				}

			}
		});

		await page.goto(playerURL);

		/*
		*		Scraping video's src attribute
		*		if it exist, return. else try source tag
		*/
	/*
		const videoSrc = await (page.$eval('video', (el) => el.getAttribute('src')).catch((err: Error) => console.log(err.message)));
		if (videoSrc && typeof videoSrc === 'string' && !videoSrc.includes('blob')) {
			resolve(videoSrc);
		}
	*/

		/*
		*		Scraping source tag src attribute
		*		if exist, return. else blob
		*/
/*
		const sourceSrc = await (page.$eval('source', (el) => el.getAttribute('src')).catch((err: Error) => console.log(err.message)));
		if (sourceSrc && !sourceSrc.includes('blob')) {
			resolve(sourceSrc);
		}
		noSource = true;
	*/

		/*
		*		Blob scraping
		*/

		if (noBlob) {
			console.log('noblob');
			console.log('noblob');
			console.log('noblob');
			resolve(null);
		}
		// maybe latter, this means we can't get p-streaming file source.
	});
}
