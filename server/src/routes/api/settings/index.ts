
import { Router } from 'express';

//	Settings Routers

import getSettingsRouter from './getSettings';

//	Settings API
const settingsAPI = Router();

settingsAPI.use("/getSettings/", getSettingsRouter);

export default settingsAPI;
