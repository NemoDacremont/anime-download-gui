
import PStreamExtractor from './pstream';
import MyStreamExtractor from './mystream';

/*
 *	Interface URLExtractor
 *	test() method is used to know if the extractor supports the url
 *	extract() method return the url source
*/
export interface URLExtractor {
	test (playerURL: string): boolean;
	extract (playerURL: string): Promise<Source>;
}

const extractors: URLExtractor[] = [
	new PStreamExtractor(),
	new MyStreamExtractor()
]


export interface Source {
	type: "MP4" | "M3U8";
	URL: string;
}

const getSourceFile = (playerURL: string): Promise<Source | null> => {
	return new Promise(async (resolve, reject) => {
		for (const extractor of extractors) {
			if (!extractor.test(playerURL)) continue;

			let output = null;
			await extractor.extract(playerURL).then((source) => {
				output = source;
			}).catch((err: Error) => console.error(err));

			if (output) resolve(output);
		}

		resolve(null);
	})
}

export default getSourceFile;

export {
	extractors,
	getSourceFile
}
