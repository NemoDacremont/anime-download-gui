
import B64Scraper from './B64Scraper';
import directScraper from './directScraper';

export interface MasterScraper {
	scrape: (playerHTML: string) => Promise<string | null>;
}

export {
	B64Scraper,
	directScraper
};
