
import { DEFAULT_VIEW } from '@/constants';
import { AnimeListView } from './settingsTypes';

export interface SettingsState {
	animeListView: AnimeListView;
}

export interface SettingsOutput {
	isGridViewSelected: boolean;
	animeListView: AnimeListView;
	setAnimeListView: void;
}

export const settingsState: SettingsState = {
	animeListView: DEFAULT_VIEW
};

export default settingsState;

