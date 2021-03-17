
import { Source, URLExtractor } from '../index';
import { page as pageStored, createPage } from '../../../../stores/puppeteer';

export default class URLExtractorMyStream implements URLExtractor {
	private readonly URLRegex = /^https:\/\/embed\.mystream\.to\/\w+$/;
	public readonly name = "MyStream Extractor";

	public test (url: string): boolean {
		return this.URLRegex.test(url);
	}

	public async extract (url: string): Promise<Source> {
		return new Promise(async (resolve, reject) => {
			// If pageStored is null means puppeteer hasn't been initialized
			if (!pageStored)	reject(new Error("Mystream extractor: Puppeteer isn't initialized"));

			//	Recreate the page if it as been closed
			const page = !(pageStored && pageStored.isClosed()) ? await createPage(): pageStored;

			await (page.goto(url).catch((err: Error) => reject(err)));

			//	Get the src attribute of the video tag
			const videoSrc = await (
				page.$eval('video', (el) => {
					return el.getAttribute('src')
				}).catch((err: Error) => reject(err))
			);

			resolve({ type: "MP4", URL: videoSrc as string} );
		});
	}
}
