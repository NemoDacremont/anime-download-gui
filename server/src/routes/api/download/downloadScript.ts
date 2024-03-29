
import https from 'https';
import fs from 'fs';
//import socketIOStore from '../../../stores/socketIO';

export default function (url: string): Promise<boolean | null> {
	return new Promise((resolve, reject) => {
		
		const fileStream = fs.createWriteStream('/home/odasta/Vidéos/test.mp4');
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

				let startDate = Date.now();
				
				if (res.statusCode !== 200) {
					reject(new Error(`Request responded with a ${res.statusCode} status code`));
				}

				res.on('error', (err) => {
					console.log(err);
					reject(err);
				});

				res.on('data', (chunk) => {
					fileStream.write(chunk)

					chunkCount++;
					lastChunksSize += chunk.length;
					totalChunkSize += chunk.length;

					if (chunkCount % 128 === 0) {
						downloadSpeed = (lastChunksSize / (Date.now() - lastDate)).toFixed(2);
						console.log('Downloading:', totalChunkSize / 1000, 'kB');

						lastDate = Date.now();
						lastChunksSize = 0;
					}
				});

				res.on('close', () => {
					console.log(`Download duration: ${((Date.now() - startDate) / 60000).toFixed(2)} min`);
					resolve(true);
				});
			});
		})

	})
}
