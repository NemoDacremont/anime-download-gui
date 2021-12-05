
import { DEFAULT_VIEW } from '@/constants';
import { AnimeListView } from './settingsTypes';

import { Socket, io } from 'socket.io-client';

export interface SettingsState {
	animeListView: AnimeListView;
	settingsSocketIOInstance: Socket | null;
}

export interface SettingsOutput {
	isGridViewSelected: boolean;
	animeListView: AnimeListView;
	setAnimeListView: void;
}

export const settingsState: SettingsState = {
	animeListView: DEFAULT_VIEW,
	settingsSocketIOInstance: io("")
};

export default settingsState;

