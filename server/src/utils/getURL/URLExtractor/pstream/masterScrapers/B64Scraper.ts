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
  private testB64: RegExp;

  constructor() {
    this.testB64 = /playerOptsB64/;
    this.scrapers = [
			this.scrapeMasterM3U8V7
    ];
  }

  public async scrape(playerHTML: string): Promise<string|null> {
    if (!this.testB64.test(playerHTML))
      return null;
    for (let i = 0; i < this.scrapers.length; i++) {
      const out = await this.scrapers[i](playerHTML);

      if (out)
        return out;
    }

    return null;
  }

  private async scrapeMasterM3U8V7(playerHTML: string): Promise<string|null> {
		const videojsURLRegExp = /https:\/\/www\.pstream\.net\/js\/videojs-(\w|=|-)*?\.js/;
		const videojsURLMatch = playerHTML.match(videojsURLRegExp);

		if (!(videojsURLMatch && videojsURLMatch[0]))
			return null;

		const videojsURL = videojsURLMatch[0];
		const videojsRequest = await axios.get(videojsURL, axiosOptions ).catch((err: Error) => console.error(err));
		if (!videojsRequest)
			return null;
		const videojsRaw = videojsRequest.data;

		if (!videojsRaw)
			return null;

		const b64Matches = videojsRaw.match(/('|")eyJ\w*?('|")/);
		if (!(b64Matches && b64Matches[0]))
			return null;

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
