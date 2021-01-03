
import https from 'https';
import fs from 'fs';

import { LevelM3u8, Segment } from '../../routes/api/animes/getURL/extractURL';
import { DownloadCallbacks, defaultCallbacks } from './downloadScript';

export type DownloadedSegment = Buffer | null;

const downloadSegment = (url: string, segmentIndex: number, downloadedSegments: Map<number, DownloadedSegment>): Promise<void> => {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			const data: Buffer[] = [];

			res.on('error', (err: Error) => {
				reject(err);
			});

			res.on('data', (chunk) => {
				data.push(chunk);
			});

			res.on('close', () => {
				downloadedSegments.set(segmentIndex, Buffer.concat(data));
				resolve();
			});
		});
	});
}

const write = (writeStream: fs.WriteStream, data: Buffer): Promise<void> => {
	return new Promise((resolve) => {
		if (!writeStream.write(data)) {
			writeStream.once('drain', () => {
				resolve();
			});
		}
		else {
			resolve();
		}
	});
}

const pipeData = (writtenSegments: number, downloadedSegments: Map<number, DownloadedSegment>, writeStream: fs.WriteStream): Promise<number> => {
	return new Promise(async (resolve) => {
		const start = writtenSegments;
		let count = 0;
		for (const segment of downloadedSegments) {
			const [key, segmentData] = segment;

			if (key === writtenSegments + count && segmentData !== null) {
				await write(writeStream, segmentData);
				count++;
			}
			else {
				break;
			}
		}

		for (let i=start ; i<start+count ; i++) {
			downloadedSegments.delete(i);
		}
		resolve(writtenSegments + count);
	});
}

export default function (outFilePath: string, source: LevelM3u8, cbs?: DownloadCallbacks): Promise<boolean | null> {
	return new Promise(async (resolve, reject) => {
		if (!source.segments) reject('err, source is not very good like i wanted jflkfjiezohfnzebnfjb');

		// merge .. .
		const { forceReject, onData } = { ...defaultCallbacks, ...cbs };

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
		console.log(`playlist size:`, length);

		const downloadedSegments: Map<number, DownloadedSegment> = new Map();
		let segmentsWritten = 0;

		for (let segmentIndex=0 ; segmentIndex<source.segments.length ; segmentIndex++) {
			const segment = source.segments[segmentIndex];

			/*
			*		Callbacks
			*/
			if (forceReject()) {
				downloadedSegments.forEach((segment, index) => { downloadedSegments.delete(index) });
				writeFileStream.close();
				reject(new Error('download canceled'));
				return;
			}

			const progress = Math.round(100 * segmentsWritten / length);
			onData(progress);
			//console.log(`Segments written: ${segmentsWritten}`);
			//console.log(`Current segment: ${segmentIndex}`);
	//		console.log('standing segment:', segmentIndex);

			// Actual weird download thing ...
			if (downloadedSegments.size <= 2) {
				downloadedSegments.set(segmentIndex, null);
				downloadSegment(segment.url, segmentIndex, downloadedSegments).catch((err: Error) => console.log(err.message));
			}
			else {
				await (new Promise((resolve) => setTimeout(() => { resolve() }, 500)) as Promise<void>);
				segmentsWritten = await pipeData(segmentsWritten, downloadedSegments, writeFileStream);

				segmentIndex--;
			}
		}

		while (downloadedSegments.size > 0) {
			await (new Promise((resolve) => setTimeout(() => { resolve() }, 500)) as Promise<void>);
			segmentsWritten = await pipeData(segmentsWritten, downloadedSegments, writeFileStream);
		}

		// Here, the download should be done
		writeFileStream.close();
		resolve(true);
	});
}
