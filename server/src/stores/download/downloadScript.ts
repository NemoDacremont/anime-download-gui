
import https from 'https';
import fs from 'fs';
//import socketIOStore from '../../../stores/socketIO';

export interface DownloadCallbacks {
	// The progress is a integer between 0 and 100
	onData: (progress: number) => void;
	forceReject: () => boolean;
}

export const defaultCallbacks: DownloadCallbacks = {
	forceReject: () => false,
	onData: () => {}
}

export default function (filePath: string, url: string, cbs?: DownloadCallbacks): Promise<boolean | null> {
	return new Promise((resolve, reject) => {
		
		// merging callbacks and then extract you know
		const { forceReject, onData } = { ...defaultCallbacks, ...cbs };

		// Create file
		try {
			fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
		} catch (err) {
			console.log(`File ${filePath} doesn't exist, creating it`);
			try {
				const dirPath = filePath.replace(/\w*\.\w*$/, '');
				fs.mkdirSync(dirPath, { recursive: true });
				fs.writeFileSync(filePath, '');
			} catch (error) {
				console.log(`File ${filePath} can't be created ouais ferme ta gueule`);
				resolve(false)
			}
		};

		const fileStream = fs.createWriteStream(filePath);
		fileStream.on('ready', () => {
			const requestOptions: https.RequestOptions = {
				headers: {
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0'
				}
			}
			
			const request = https.get(url, requestOptions, (res) => {
				let chunkCount = 0;
				let lastChunksSize = 0;
				let totalChunkSize = 0;
				let lastDate = Date.now();
				let downloadSpeed: string | number = 0;
				const fileSize = parseInt(res.headers["content-length"]? res.headers["content-length"]: '0', 10);
				console.log('file size:', fileSize);

				let startDate = Date.now();
				
				if (res.statusCode !== 200) {
					reject(new Error(`Request responded with a ${res.statusCode} status code`));
				}

				res.on('error', (err) => {
					reject(err);
				});

				res.on('data', (chunk) => {
					if (forceReject()) {
						request.destroy();
						reject(new Error('download canceled'));
						return;
					}

					fileStream.write(chunk)

					chunkCount++;
					lastChunksSize += chunk.length;
					totalChunkSize += chunk.length;

					if (chunkCount % 128 === 0) {
						const progress = Math.round(100 * totalChunkSize / fileSize);
						onData(progress);
						lastDate = Date.now();
						lastChunksSize = 0;
					}
				});

				res.on('close', () => {
					fileStream.close();

					const progress = Math.round(100 * totalChunkSize / fileSize);
					onData(progress);

					console.log(`Download duration: ${((Date.now() - startDate) / 60000).toFixed(2)} min`);
					resolve(true);
				});
			});
		})

	})
}
