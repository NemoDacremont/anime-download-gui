import {decodeB64} from '../../../../base64';
import axios, { AxiosRequestConfig} from "axios";
import {MasterScraper} from '.';

type PStreamMasterScraper = (playerHTML: string) => (string | null | Promise<string|null>);

const axiosOptions: AxiosRequestConfig = {
	maxRedirects: 0,
	headers: {
		"Accept-Encoding": "gzip, deflate, br",
		"Accept-Language": "en-US,en;q=0.5",
	}
}

export class B64Scraper implements MasterScraper {
  public scrapers: PStreamMasterScraper[] = [];

  constructor() {
    this.scrapers = [
			this.scrapeMasterM3U8V7
    ];
  }

  public async scrape(playerHTML: string): Promise<string|null> {
    for (let i = 0; i < this.scrapers.length; i++) {
      const out = await this.scrapers[i](playerHTML);

      if (out)
        return out;
    }

    return null;
  }

  private async scrapeMasterM3U8V7(playerHTML: string): Promise<string|null> {
		const videojsURLRegExp = /https:\/\/www\.pstream\.net\/u\/player-script\?v=\w+&e=\w+/;
		const videojsURLMatch = playerHTML.match(videojsURLRegExp);

		if (!(videojsURLMatch && videojsURLMatch[0])) {
			console.error("can't find pstream player js file link in the player source");
			console.error(`videojsURLMatch: ${videojsURLMatch}`);
			return null;
		}

		const videojsURL = videojsURLMatch[0];
		const videojsRequest = await axios.get(videojsURL, axiosOptions ).catch((err: Error) => console.error(err));
		if (!videojsRequest) {
			console.error("pstream player js source request failed");
			console.error(`videojsRequest: ${videojsRequest}`);
			return null;
		}
		const videojsRaw = videojsRequest.data;

		if (!videojsRaw) {
			console.error("pstream response is null");
			console.error(`videojsRaw: ${videojsRaw}`);
			return null;
		}

		const b64Matches = videojsRaw.match(/"eyJ\w*?"/);
		if (!(b64Matches && b64Matches[0])) {
			console.error("can't match b64 m3u8 source");
			console.error(`b64Matches: ${b64Matches}`);
			return null;
		}

		const b64 = b64Matches[0].replace(/"/g, "");
		const decoded = decodeB64(b64);
		try {
      return JSON.parse(decoded).url;
    } catch (err) {
      console.error(err);
			return null;
    }
  }
}

export default B64Scraper;
