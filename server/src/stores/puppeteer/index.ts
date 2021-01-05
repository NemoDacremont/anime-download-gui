
import puppeteer from 'puppeteer-core';
import { chromiumPath } from '../../constants';

// TO-DO: Maybe at least read the documentation

export let browser: puppeteer.Browser;
export let page: puppeteer.Page | null = null;

export async function initPuppeteer(): Promise<void> {
	browser = await puppeteer.launch({
		headless: true,
		executablePath: chromiumPath
	});

	browser.on('disconnected', (err) => {
		console.log(err);
		console.log('disconnected');
	});

	page = await browser.newPage();
}

export async function createPage (): Promise<puppeteer.Page> {
	if (!page || page.isClosed()) {
		page = await browser.newPage();
	}
	return page;
}
