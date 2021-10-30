
import { MutationTree } from 'vuex';
import { AnimeListState as State } from './animeListState';
import { LoadDataPayload } from './animeListTypes';

export interface AnimeListMutations {
	loadData (state: State, payload: LoadDataPayload): void;
}


export const animeListMutations: MutationTree<State> & AnimeListMutations = {
	loadData: (state, payload) => {
		const { version, data } = payload;
		state[version] = data;
	}
};

export default animeListMutations;
