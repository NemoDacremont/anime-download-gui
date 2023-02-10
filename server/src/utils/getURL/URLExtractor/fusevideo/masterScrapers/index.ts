
import B64Scraper from './B64Scraper';

export interface MasterScraper {
	scrape: (playerHTML: string) => Promise<string | null>;
}

export {
	B64Scraper
};
