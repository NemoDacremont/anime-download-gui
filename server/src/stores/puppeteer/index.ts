
import puppeteer from 'puppeteer';

// TO-DO: Maybe at least read the documentation

export let browser: puppeteer.Browser;
export const pages: puppeteer.Page[] = [];

export async function initPuppeteer(): Promise<void> {
	browser = await puppeteer.launch();
}
