
import { Source, URLExtractor } from '../index';
import axios, { AxiosRequestConfig } from 'axios';
import { decodeB64 } from '../../../base64';
import B64Scraper from './B64Scraper';

type M3U8ScraperFunction = (playerHTML: string) => string | null;
const b64Scraper = new B64Scraper();

export default class URLExtractorPStream implements URLExtractor {
	private readonly urlRegex = /^https:\/\/www\.pstream\.net\/\w\/\w+$/;
	public readonly name = "PStream Extractor";
	private readonly M3U8Scrapers: M3U8ScraperFunction[];

	constructor () {
		this.M3U8Scrapers = [ this.scrapeMasterM3U8Direct ];
	}

	public test (playerURL: string): boolean {
		return this.urlRegex.test(playerURL);
	}

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

			const html: string = (await axios.request({ url: playerURL, ...axiosOptions })).data;
			
			const masterM3U8URL = this.scrapeMasterM3U8(html);
			if (!masterM3U8URL)	{ reject(new Error("Pstream extractor: no master m3u8 matched")); return; }

			const masterM3U8: string = (await axios.request({ url: masterM3U8URL, ...axiosOptions })).data;
			
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

	private scrapeMasterM3U8Direct (playerHTML: string): string | null {
		const masterM3U8RegExp = /https:\/\/w.+ww\.pstream\.net\/\w\/\w*\.m3u8\?expires=\d*?&signature=\w*?"/m;
		const masterM3U8Matches = playerHTML.match(masterM3U8RegExp);

		if (masterM3U8Matches) return masterM3U8Matches[0].replace(/ |\+|"/g, "");
		return null;
	}

	private scrapeMasterM3U8 (playerHTML: string): string | null {
		const { M3U8Scrapers } = this;

		const out = b64Scraper.scrape(playerHTML);
		if (out) return out;

		for (let i=0 ; i<M3U8Scrapers.length ; i++) {
			const out = M3U8Scrapers[i](playerHTML);
			if (out) return out;
		}

		return null;
	}
}
