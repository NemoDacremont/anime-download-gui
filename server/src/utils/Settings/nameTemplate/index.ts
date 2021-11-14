
import { socketIOStore } from "../../../stores/socketIO/index";
import { downloader } from "../../../stores/download";
import { settings } from "../../../stores/settings";

import { createEpisodeName } from './createEpisodeName';

const socketIOInstance = socketIOStore.socketIOInstance;

const initEpisodeName = (): void => {
	if (!socketIOInstance) return;

	socketIOInstance.on("updateEpisodeNameTemplate", (newTemplate: string) => {
		if (downloader.isDownloading) {
			socketIOInstance.send("error", "can't update the download path, app is downloading");
			return;
		}
		
		settings.episodeNameTemplate = newTemplate;
	});
}

export {
	initEpisodeName,
	createEpisodeName
}

