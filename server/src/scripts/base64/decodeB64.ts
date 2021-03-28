
import { Buffer } from 'buffer';

export default function (strToDecode: string): string {
	const tmp = Buffer.from(strToDecode, "base64");
	return tmp.toString("ascii");
}
