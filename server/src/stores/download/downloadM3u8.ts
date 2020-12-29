
import https from 'https';
import fs from 'fs';

import { LevelM3u8 } from '../../routes/api/animes/getURL/extractURL';

const pipeData = (url: string, writeStream: fs.WriteStream): Promise<void> => {
	return new Promise((resolve, reject) => {
		const req = https.get(url, (res) => {
			res.on('error', (err) => {
				reject(err);
			});

			res.on('data', (chunk) => {
				writeStream.write(chunk);
			});

			res.on('close', () => {
				resolve();
			});
		})
	});
}

export default function (outFilePath: string, source: LevelM3u8): Promise<boolean | null> {
	return new Promise(async (resolve, reject) => {
		if (!source.segments) reject('err, source is not very good like i wanted jflkfjiezohfnzebnfjb');

		// Create the files and the writeFileStream
		try {
			fs.accessSync(outFilePath, fs.constants.R_OK | fs.constants.W_OK);
		} catch (err) {
			console.log(`File ${outFilePath} doesn't exist, creating it`);
			try {
				const dirPath = outFilePath.replace(/\w*\.\w*$/, '');
				fs.mkdirSync(dirPath, { recursive: true });
				fs.writeFileSync(outFilePath, '');
			} catch (error) {
				console.log(`File ${outFilePath} can't be created ouais ferme ta gueule`);
				resolve(false)
			}
		};

		const writeFileStream = fs.createWriteStream(outFilePath);
		const length = source.segments.length;

		for (let segmentIndex in source.segments) {
			const segment = source.segments[segmentIndex];
			console.log(`segment ${segmentIndex} / ${length}`);
			await (pipeData(segment.url, writeFileStream).catch((err: Error) => console.log(err.message)));
		}

		// Here, the download should be done
		writeFileStream.close();
		resolve(true);
	});
}
