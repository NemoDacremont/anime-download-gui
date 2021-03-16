
import { Source, URLExtractor } from '../index';
import axios, { AxiosRequestConfig } from 'axios';

export default class URLExtractorPStream implements URLExtractor {
	private readonly urlRegex = /^https:\/\/www\.pstream\.net\/\w\/\w+$/;

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

			// The error 127.0.0.1:443 things probably comes from here
			const html: string = (await axios.request({ url: playerURL, ...axiosOptions })).data;

			const masterM3U8RegExp = /https:\/\/w.+ww\.pstream\.net\/\w\/\w*\.m3u8\?expires=\d*?&signature=\w*?"/m;
			const masterM3U8Matches = html.match(masterM3U8RegExp);
			if (!(masterM3U8Matches && masterM3U8Matches[0]))	{
				reject(new Error("Pstream extractor: no master m3u8 matched"));
				return;
			}

			const masterM3U8URL = (masterM3U8Matches[0] as string).replace(/ |\+|"/g, "");

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
}
