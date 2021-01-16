
import puppeteer from 'puppeteer-core';
import { chromiumPath } from '../../constants';

// TO-DO: Maybe at least read the documentation

export let browser: puppeteer.Browser;
export let page: puppeteer.Page | null = null;

const args = [
	/*'--disable-gpu',
	'--disable-dev-shm-usage',
	'--disable-setuid-sandbox',
	'--no-first-run',
	'--no-sandbox',
	'--no-zygote',
	'--single-process',*/
]

export async function initPuppeteer(): Promise<void> {
	browser = await puppeteer.launch({
		//args,
		headless: true,
		ignoreHTTPSErrors: true,
		executablePath: chromiumPath
	});

	browser.on('disconnected', (err) => {
		console.log(err);
		console.log('disconnected');
	});

	page = await createPage();
}

export async function createPage (): Promise<puppeteer.Page> {
	if (!page || page.isClosed()) {
		page = await browser.newPage();
		page.setDefaultNavigationTimeout(0);
	}
	return page;
}
