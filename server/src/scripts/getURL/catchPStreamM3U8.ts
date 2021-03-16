
// import { Response } from 'puppeteer-core';

// const pStreamManifestRegex = /^https:\/\/www\.pstream\.net\/\w\/\w*?$\.m3u8/i;
// const manifestsRegex = /^https:\/\/www\.pstream\.net\/h\/\d+\/\w*?\.m3u8\?expires=\d+&signature=\w+$/m;


// export default async function (response: Response): Promise<string | null> {
// 	if (!pStreamManifestRegex.test(response.url())) return null;

// 	const manifests = await response.text();

// 	const bestManifests = manifests.match(manifestsRegex)
// 	const bestManifestURL = bestManifests ? bestManifests[0]: null;

// 	return bestManifestURL;
// }
