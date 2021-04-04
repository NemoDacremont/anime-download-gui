
import { Source, URLExtractor } from '../index';
import axios from "axios";
import JJDecodeMyStream from "./JJDecodeMyStream";

export default class URLExtractorMyStream implements URLExtractor {
	private readonly URLRegex = /^https:\/\/embed\.mystream\.to\/\w+$/;
	public readonly name = "MyStream Extractor";

	public test (playerURL: string): boolean {
		return this.URLRegex.test(playerURL);
	}

	public async extract (playerURL: string): Promise<Source> {
		return new Promise(async (resolve, reject) => {
			const playerHTML = (await axios.get(playerURL)).data;
			
			const JJEncodedMatch = playerHTML.match(/\$=~\[\].+;$/m);
			if (!JJEncodedMatch) { reject(new Error("No JJencoded match.")); return; }

			let JJDecoded = null;
			try {
				JJDecoded = JJDecodeMyStream(JJEncodedMatch[0]);
			}
			catch (err) {
				console.error(err);
				return;
			}
			if (!JJDecoded) return;

			console.log(JJDecoded);

			const URLRegExp = /https?:\/\/\w+\.mscontent.net(\/(\w|-|_|\.)+)+.mp4/;
			const urlMatch = JJDecoded.match(URLRegExp);
			if (!urlMatch) {
				reject(new Error("URL not matched"));
				return;
			}

			resolve({type: "MP4", URL: urlMatch[0]});
		});
	}
}
