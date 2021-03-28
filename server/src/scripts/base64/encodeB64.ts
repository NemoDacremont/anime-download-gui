
import { Buffer } from 'buffer';

export default function (strToEncode: string): string {
	const tmp = Buffer.from(strToEncode, "ascii");
	return tmp.toString('base64');
}
