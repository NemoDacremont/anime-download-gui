
import { ActionTree, ActionContext } from 'vuex';

// Needed types
import { AnimeListMutations as Mutations } from './animeListMutations';
import { AnimeListState as State } from './animeListState';
import { Version, Anime } from './animeListTypes';

// Dep
import axios from 'axios';
import { API_BASE_URL } from '@/constants';

// Needed type
type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, 'commit'>

// Interface
export interface AnimeListActions {
	loadData ({commit}: AugmentedActionContext, payload: Version): Promise<boolean>;
}


// Needed function

// Download the anime list from the local server
const load = async (version: 'vostfr' | 'vf'): Promise<Anime[]> => {
	return (await axios.get( `${API_BASE_URL}/animes/animelist/${version}` )).data
}

// Actual actions
export const animeListActions: ActionTree<State, State> & AnimeListActions = {
	async loadData (store, version: 'vostfr' | 'vf'): Promise<boolean> {
		const data = await load(version);
		store.commit('loadData', {
			version,
			data
		});
		return true;
	}
}

export default animeListActions;

