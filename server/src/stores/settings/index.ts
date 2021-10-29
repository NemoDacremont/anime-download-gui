
import config from "../../config.json";
import defaultconfig from "../../config.default.json";
import parseDownloadPath from "../../utils/Settings/downloadPath/parseDownloadPath";

export interface Settings {
	downloadPath: string;
	
};

export const settings: Settings = {
	downloadPath: config.outputDir
		? parseDownloadPath(config.outputDir)
		: parseDownloadPath(defaultconfig.outputDir),

};

