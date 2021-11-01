
import { socketIOStore } from "../../../stores/socketIO/index";
import { downloader } from "../../../stores/download";
import { settings } from "../../../stores/settings";

import {} from './createEpisodeName';

const socketIOInstance = socketIOStore.socketIOInstance;

export const initEpisodeName = (): void => {
	socketIOInstance.on("updateEpisodeNameTemplate", (newTemplate: string) => {
		if (downloader.isDownloading) {
			socketIOInstance.send("error", "can't update the download path, app is downloading");
			return;
		}
		
		settings.episodeNameTemplate = newTemplate;
	});
}

