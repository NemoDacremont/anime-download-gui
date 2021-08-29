
import { MasterScraper } from '.';

export class DirectMasterScraper implements MasterScraper {	
	public async scrape (playerHTML: string): Promise<string | null> {
		const masterM3U8RegExp = /https:\/\/w.+ww\.pstream\.net\/\w\/\w*\.m3u8\?expires=\d*?&signature=\w*?"/m;
		const masterM3U8Matches = playerHTML.match(masterM3U8RegExp);

		if (masterM3U8Matches) return masterM3U8Matches[0].replace(/ |\+|"/g, "");
		return null;
	}
}

export default DirectMasterScraper;
