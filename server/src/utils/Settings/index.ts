
import { initDownloadPath } from "./downloadPath";
import { initEpisodeName } from './nameTemplate';

export const initSettings = () => {
	initDownloadPath();
	initEpisodeName();
}

export default initSettings;

