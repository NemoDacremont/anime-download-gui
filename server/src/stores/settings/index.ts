
//import config from "../../config.json";
//import defaultconfig from "../../config.default.json";
import parseDownloadPath from "../../utils/Settings/downloadPath/parseDownloadPath";

import { readJSON } from '../../utils/readJSON';

export const config = readJSON("../../config.json");
export const defaultConfig = readJSON("../../config.default.json");

export interface Settings {
	downloadPath: string;
	episodeNameTemplate: string;
};

export const settings: Settings = {
	downloadPath: config.outputDir
		? parseDownloadPath(config.outputDir)
		: parseDownloadPath(defaultConfig.outputDir),
	episodeNameTemplate: '{ episodeTitle }'
};

