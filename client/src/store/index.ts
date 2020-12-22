import { createStore } from 'vuex'

/*
*		Modules
*/

import animeListStore from './animeList';
import settings from './settings';

/*
*		Store
*/

export default createStore({
	modules: {
		settings,
		animeListStore
	}
})
