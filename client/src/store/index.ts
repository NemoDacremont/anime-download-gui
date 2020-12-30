import { createStore } from 'vuex'

/*
*		Modules
*/

import animeListStore from './animeList';
import settings from './settings';
import download from './download';

/*
*		Store
*/

export default createStore({
	modules: {
		animeListStore,
		settings,
		download
	}
})
