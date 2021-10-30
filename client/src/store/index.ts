
import { createStore } from 'vuex';

/*
*		Modules
*/

import animeListModule from './animeList';
import settingsModule from './settings';
import downloadModule from './download';

import { AnimeListState } from './animeList/animeListState';
import { SettingsState } from './settings/settingsState';
import { DownloadState } from './download/downloadState';

/*
*		Stores
*/

export type State = AnimeListState & SettingsState & DownloadState;

export const stores= createStore<State>({
	modules: {
		animeListModule,
		settingsModule,
		downloadModule
	},
	strict: true,
	devtools: true
});

export default stores;

