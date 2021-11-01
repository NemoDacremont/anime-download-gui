
import { readFileSync, existsSync } from 'fs';

export const readJSON = (filePath: string): any => {
	if (!existsSync(filePath)) return null;

	return JSON.parse( readFileSync(filePath).toString() );
}

