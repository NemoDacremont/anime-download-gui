

import { Source, URLExtractor } from '../index';
import axios from "axios";
// import JJDecodeMyStream from "./JJDecodeMyStream";

const addHeaders = {
	// "User-Agent": " Mozilla/5.0 (X11; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
	"Accept": " video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
	"Accept-Language": " en-US,en;q=0.5",
	"Connection": " keep-alive",
	// "Referer": " https://streamtape.com/e/Rq2brbKg1QFdWj3/Chainsaw_Man_S01E11_VOSTFR_1080p_WEB_x264_AAC_-Tsundere-Raws_%28CR%29.mkv",
	"Cookie": " _b=kube17; _csrf=e7dbdf9f5e88effa48b4f9faa24841aef8e473be427e61754f16a3bfc33c37aaa%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22FZV7BRR76YhSN4a0Qw_kQyHGlpXO45-Y%22%3B%7D",
	"Sec-Fetch-Dest": " video",
	"Sec-Fetch-Mode": " cors",
	"Sec-Fetch-Site": " same-origin",
	"Accept-Encoding": " identity"
}

export default class URLExtractorMyStream implements URLExtractor {
	private readonly URLRegex = /^https:\/\/embed\.mystream\.to\/\w+$/;
	public readonly name = "MyStream Extractor";

	public test (playerURL: string): boolean {
		return this.URLRegex.test(playerURL);
	}

	public async extract (playerURL: string): Promise<Source> {
		return new Promise(async (resolve, reject) => {
			const playerHTML = (await axios.get(playerURL)).data as string;
			
			const robotLinkMatch = playerHTML.match(/^\/streamtape\.com\/get_video\?id=\w+\&expires=\d+&ip=\w+\&token=(\w|-)+/gm);
			if (!robotLinkMatch) { reject(new Error("Streamtape: No robotLinkMatch.")); return; }

			const url = "http:/" + robotLinkMatch[0] + "stream=1";

			const referer = playerURL

			const additionalHeaders = {
				"Referer": referer,
				...addHeaders
			}

			resolve({ type: "MP4", URL: url, additionalHeaders });
		});
	}
}

