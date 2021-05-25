
import { Router } from 'express';

import { openInBrowserOnLoad, port, outputDir, openOnLocalNetwork, ffmpegPath } from '../../../constants';
import {Config} from "./changeSettings";

const getSettingsRouter = Router();

getSettingsRouter.get("/", (req, res) => {
	const settings: Config = {
		openInBrowserOnLoad,
		port,
		outputDir,
		openOnLocalNetwork,
		ffmpegPath
	};

	res.json(settings);
});

export default getSettingsRouter;
