
import { MutationTree } from 'vuex';
import { AnimeListView } from './settingsTypes';
import { SettingsState as State } from './settingsState';

export interface SettingsMutations<S = State> {
	SetAnimeListView: (state: S, newAnimeListView: AnimeListView) => void;
}

export const settingsMutations: MutationTree<State> & SettingsMutations = {
	SetAnimeListView: (state, newAnimeListView) => {
		state.animeListView = newAnimeListView;
	}
};

export default settingsMutations;

