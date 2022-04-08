
import axios, { AxiosResponse } from 'axios';

// Constants
import { NEKO_SAMA_BASE_URL } from '../../constants';

// TS things

/*
 *	New Example
 *	{
 *		"time": "il y a 4 heures",
 *		"episode": "Ep. 50",
 *		"title": "Pocket Monsters (2019)",
 *		"url": "/anime/episode/16381-pocket-monsters-2019-50-vostfr",
 *		"anime_url": "/anime/info/16381-pocket-monsters-2019-vostfr",
 *		"url_image": "https://cdn10.neko-sama.xyz/3/25d36360c95ddcdd9687dd95f09ab64c.jpg",
 *		"url_bg": "https://cdn31.neko-sama.xyz/3/25d36360c95ddcdd9687dd95f09ab64c.jpg"
 *	}
*/

export interface New {
	time: string;
	episode: string;
	title: string;
	url: string;
	anime_url: string;
	url_image: string;
	url_bg: string;
}

export interface News {
	[index: number]: New;
}

export default function (): Promise<News> {
	return new Promise((resolve, reject) => {
		axios.get(NEKO_SAMA_BASE_URL).then((response: AxiosResponse<string>) => {
			// Get required cookie by cloudflare for next axios requests
			if (response.headers["set-cookie"] && response.headers["set-cookie"][0]) {
				const cookieMatch = (response.headers["set-cookie"][0] as string).match(/[\w]+=[\w\-\+\/]+;/g);
				if (cookieMatch) {
					const keyValueCookie = cookieMatch[0].replace(";", "").split("=");

					if (keyValueCookie) {
						if (!axios.defaults.headers.common["cookie"]) {
							axios.defaults.headers.common["cookie"] = {};
						}

						axios.defaults.headers.common["cookie"][keyValueCookie[0]] = keyValueCookie[1];
					}
				}
			}
			// 
			const html: string = response.data;
			const rawMatch = html.match(/lastEpisodes = .*?\n/g);

			if (!rawMatch || !rawMatch[0]) reject(new Error('Match failed when getting news from neko sama'));
			else {
				const match = rawMatch[0].replace(/(lastEpisodes = )|(;)/g, '');
				try {
					const output = JSON.parse(match);
					resolve(output);
				} catch (error) {
					reject(error);
				}
			}
		}).catch((err) => {
			reject(err)
		});
	});
}
