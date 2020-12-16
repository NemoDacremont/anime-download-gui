
import { JSDOM } from "jsdom";
import axios from 'axios';

import { Anime } from "../../../stores/animes";
import pages from '../../../stores/jsdom';


export default async function (anime: Anime, version: string, episode: number): Promise<string> {
	console.log(anime);
	const formattedTitle = anime.title?.replace(/:|-/g, '').toLowerCase().replace(/ /g, '-');

	const animeURL = `https://neko-sama.fr/anime/episode/${anime.id}-${formattedTitle}-${episode}-${version}`;
	const animePage = (await axios.get(animeURL)).data;

	const pageIndex = pages.push(new JSDOM(animePage));
	const page = pages[pageIndex - 1];

	console.log(page.window.document.querySelector('body')?.innerHTML);

	return '';
}
