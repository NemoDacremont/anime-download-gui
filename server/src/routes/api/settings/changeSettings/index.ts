
import { Router } from 'express';
import {ffmpegPath, openInBrowserOnLoad, openOnLocalNetwork, outputDir, port} from "../../../../constants";
import defaultConfig from '../../../../config.default.json';


import updatePort from "./updatePort";

const configFilePath = "../../../../config.json";
const defaultConfigFilePath = "../../../../config.default.json";

namespace Config {
	type keys = [
		"openInBrowserOnLoad",
		"port",
		"outputDir",
		"openOnLocalNetwork",
		"ffmpegPath",
	];


}

export interface Config {
	openInBrowserOnLoad: boolean;
	port: number;
	outputDir: string;
	openOnLocalNetwork: boolean;
	ffmpegPath: string;
}

export interface RawConfig {
	openInBrowserOnLoad: string;
	port: string;
	outputDir: string;
	openOnLocalNetwork: string;
	ffmpegPath: string;
}


const updaters = [
	updatePort,
]

//	ChangeSettingsRouter
const changeSettingsRouter = Router();

changeSettingsRouter.post("/", (req, res) => {

});

export default changeSettingsRouter;
