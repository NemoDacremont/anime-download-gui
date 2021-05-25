
import { RawConfig } from "./index";

export function updatePort (newConfig: RawConfig): number | null {
	const newPort = parseInt(newConfig.port);
	if (isNaN(newPort)) return null;

	return newPort;
}

export default updatePort;
