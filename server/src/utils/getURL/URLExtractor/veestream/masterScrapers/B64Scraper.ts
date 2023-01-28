
import {decodeB64} from '../../../../base64';
import axios, { AxiosRequestConfig} from "axios";
import { MasterScraper } from '.';

type VeeStreamMasterScraper = (playerHTML: string) => (string | null | Promise<string|null>);

const axiosOptions: AxiosRequestConfig = {
	maxRedirects: 0,
	headers: {
		"Accept-Encoding": "gzip, deflate, br",
		"Accept-Language": "en-US,en;q=0.5",
	}
}

export class B64Scraper implements MasterScraper {
  public scrapers: VeeStreamMasterScraper[] = [];

  constructor() {
    this.scrapers = [
			this.scrapeMasterM3U8V7
    ];
  }

  public async scrape(playerHTML: string): Promise<string|null> {
		// Teste pour tous les scrapers
    for (let i = 0; i < this.scrapers.length; i++) {
      const out = await this.scrapers[i](playerHTML);

			// Si un résultat, retourne, pas la peine de faire tous les scrapers
      if (out)
        return out;
    }

		// Cas de base
		console.error("no VeeStream scraper was able to find the url");
    return null;
  }

  private async scrapeMasterM3U8V7(playerHTML: string): Promise<string|null> {
		const videojsURLRegExp = /https:\/\/veestream\.net\/u\/player-script\?v=\w+&e=\w+/;
		const videojsURLMatch = playerHTML.match(videojsURLRegExp);

		console.log("finding videojs url")
		if (!(videojsURLMatch && videojsURLMatch[0])) {
			console.error("can't find VeeStream's player js code in the player source");
			console.error(`videojsURLMatch: ${videojsURLMatch}`);
			return null;
		}
		console.log("videojs url found")

		console.log("downloading videojs url")
		const videojsURL = videojsURLMatch[0];
		const videojsRequest = await axios.get(videojsURL, axiosOptions ).catch((err: Error) => console.error(err));
		if (!videojsRequest) {
			console.error("VeeStream player js source request failed");
			console.error(`videojsRequest: ${videojsRequest}`);
			return null;
		}
		const videojsRaw = videojsRequest.data;
		console.log("videojs url downloaded")

		if (!videojsRaw) {
			console.error("VeeStream videojs response is null");
			console.error(`videojsRaw: ${videojsRaw}`);
			return null;
		}

		const b64Matches = videojsRaw.match(/\)}\("[A-Za-z\d\/=]+"\)/);
		if (!(b64Matches && b64Matches[0])) {
			console.error("can't match b64 m3u8 source");
			console.error(`b64Matches: ${b64Matches}`);
			return null;
		}

		//
		// Slice part
		//

		const slice_raw_matches = videojsRaw.match(/slice\(\d+\)\)}\("[A-Za-z\d\/=]+"\)/);

		let slice_match = "";
		let slice_length = 0;

		if (slice_raw_matches && slice_raw_matches[0]) {
			slice_match = slice_raw_matches[0];
			const slice_length_match = slice_match.match(/\d+/);

			if (slice_length_match && slice_length_match[0]) {
				slice_length = parseInt(slice_length_match[0]);
			}
		}

		//
		// End of slice part
		//

		// Remove the parasite chars used to match the b64 scring
		const B64RawMatch = b64Matches[0].replace(/[}\(\)"]|slice\(\d*?\)/g, "");
		console.log("got the b64 match");

		// Just recreated the process of the script himself, they added a random char at pos 1, removing it
		const B64decoded = decodeB64(B64RawMatch).slice(slice_length);
		try {
			const json = JSON.parse(B64decoded);
			console.log("url:", json.mmmmmmmmmmmmmmmmmmmm);
      return json.mmmmmmmmmmmmmmmmmmmm;
    } catch (err) {
      console.error(err);
			return null;
    }
  }
}

export default B64Scraper;
