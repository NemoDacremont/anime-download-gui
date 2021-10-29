
import { Source, URLExtractor } from '../index';
import axios, { AxiosRequestConfig } from 'axios';
import { B64Scraper, /*directScraper,*/ MasterScraper } from './masterScrapers';

export default class URLExtractorPStream implements URLExtractor {
	private readonly urlRegex = /^https:\/\/www\.pstream\.net\/\w\/\w+$/;
	public readonly name = "PStream Extractor";
	private readonly M3U8Scrapers: MasterScraper[];

	constructor () {
		this.M3U8Scrapers = [
			new B64Scraper()
			//new directScraper()
		];
	}

	//	Test if the extractor is associated to the player URL
	public test (playerURL: string): boolean {
		return this.urlRegex.test(playerURL);
	}

	//	Extract the URL
	public extract (playerURL: string): Promise<Source> { 
		return new Promise(async (resolve, reject) => {
			//	This headers are required to bypass servers tests
			const axiosOptions: AxiosRequestConfig = {
				maxRedirects: 0,
				headers: {
					"Accept-Encoding": "gzip, deflate, br",
					"Accept-Language": "en-US,en;q=0.5",
				}
			}

			const playerRequest = await axios.request({ url: playerURL, ...axiosOptions }).catch(err => console.error(err));
			if (!playerRequest) {
				reject(new Error("Pstream extractor: playerRequest failed"));
				return null;
			}

			const html = playerRequest.data;
			
			const masterM3U8URL = await (this.scrapeMasterM3U8(html).catch(err => console.error(err)));
			if (!masterM3U8URL)	{
				reject(new Error("Pstream extractor: scraping of masterM3U8 failed"));
				return null;
			}

			const masterM3U8Request = await axios.request({ url: masterM3U8URL, ...axiosOptions }).catch(err => console.error(err));
			if (!masterM3U8Request) {
				reject(new Error("Pstream extractor: masterM3U8 request failed"));
				return null;
			}
			const masterM3U8 = masterM3U8Request.data;
			
			const mediaM3U8RegExp = /^https:\/\/www\.pstream\.net\/\w\/\d+\/\w+\.m3u8\?expires=\d+&signature=\w+$/m;
			const mediaM3U8Matches = masterM3U8.match(mediaM3U8RegExp);
			if (! (mediaM3U8Matches && mediaM3U8Matches[0]) ) {
				reject(new Error("Pstream extractor: no media m3u8 matched"));
				return;
			}

			const mediaM3U8URL: string = mediaM3U8Matches[0];

			resolve({ type: "M3U8", URL: mediaM3U8URL });
		});
	}

	private async scrapeMasterM3U8 (playerHTML: string): Promise<string | null> {
		for (let i=0 ; i<this.M3U8Scrapers.length ; i++) {
			const out = await this.M3U8Scrapers[i].scrape(playerHTML).catch(err => console.error(err));
			if (out) return out;
		}

		return null;
	}
}
