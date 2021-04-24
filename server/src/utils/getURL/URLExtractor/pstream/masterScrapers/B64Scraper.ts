
import { MasterScraper } from '.';
import { decodeB64 } from '../../../../base64';

type PStreamMasterScraper = (playerHTML: string) => string | null;

export class B64Scraper implements MasterScraper {
	public scrapers: PStreamMasterScraper[] = [];
	private testB64: RegExp;

	constructor () {
		this.testB64 = /playerOptsB64/;
		this.scrapers = [
			this.scrapeMasterM3U8B64,
			this.scrapeMasterM3U8B64Separated,
			this.scrapeMasterM3U8B64MultiPart
		];
	}

	public scrape (playerHTML: string): string | null {
		if (!this.testB64.test(playerHTML)) return null;
		for (let i=0 ; i<this.scrapers.length ; i++) {
			const out = this.scrapers[i](playerHTML);

			if (out) return out;
		}

		return null;
	}

	private scrapeMasterM3U8B64 (playerHTML: string): string | null {
		const B64RegExp = /var playerOptsB64 = "(\w|=)*?";/;
		const B64Matches = playerHTML.match(B64RegExp);
		if (!B64Matches) return null;

		const rawDecode = decodeB64(
			B64Matches[0].replace(/(var playerOptsB64 = )|;/g, "")
		);

		try {
			return JSON.parse(rawDecode).url;
		} catch (error) {
			console.error("Can't parse JSON from pStream extractor.")
		}

		return null;
	}

	private scrapeMasterM3U8B64Separated (playerHTML: string): string | null {
		const B64RegExp = /var playerOptsB64 = "(\w|=| |\+)*?"/;
		const B64Matches = playerHTML.match(B64RegExp);
		if (!B64Matches) return null;

		const rawDecode = decodeB64(
			B64Matches[0].replace(/(var playerOptsB64 = )|"| |\+/g, "")
		);

		try {
			return JSON.parse(rawDecode).url;
		} catch (error) {
			console.error("Can't parse JSON from pStream extractor.")
		}

		return null;
	}

	private scrapeMasterM3U8B64MultiPart (playerHTML: string): string | null {
		const p1RegExp = /p1 = "(\w|=)*?"/, p2RegExp = /p2 = "(\w|=)*?"/;
		if (!(p1RegExp.test(playerHTML) && p2RegExp.test(playerHTML))) return null;

		const p1Match = playerHTML.match(p1RegExp), p2Match = playerHTML.match(p2RegExp);

		if (!(p1Match && p2Match)) return null;

		const p1Raw = p1Match[0].replace(/(p1 = )|"/g, "");
		const p2Raw = p2Match[0].replace(/(p2 = )|"/g, "");

		const decoded = decodeB64(p1Raw + p2Raw);
		try {
			return JSON.parse(decoded).url;
		} catch (err) {
			console.error(err);
		}
		return null;
	}
}

export default B64Scraper;
