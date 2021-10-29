
import { socketIOStore } from "../../../stores/socketIO/index";
import { downloader } from "../../../stores/download";
import { settings } from "../../../stores/settings";

import parseDownloadPath from "./parseDownloadPath";

export const initDownloadPath = () => {
	const socketInstance = socketIOStore.socketIOInstance;

	socketInstance.on("updateDownloadPath", (newPath: string) => {
		if (downloader.isDownloading) {
			socketInstance.send("error", "can't update the download path, app is downloading");
			return;
		}

		settings.downloadPath = parseDownloadPath(newPath);
	});
};

export default initDownloadPath;

