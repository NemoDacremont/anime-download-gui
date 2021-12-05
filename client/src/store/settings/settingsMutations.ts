
import { MutationTree } from 'vuex';
import { AnimeListView } from './settingsTypes';
import { SettingsState as State } from './settingsState';

import { Socket } from 'socket.io-client';

export interface SettingsMutations<S = State> {
	SetAnimeListView: (state: S, newAnimeListView: AnimeListView) => void;
	connectSocketIOClient: (state: S) => Socket | null;
	disconnectSocketIOClient: (state: S) => Socket | null;
	toggleOpenOnLocalNetwork: (state: S) => null;
	changeServerPort: (state: S, newPort: number) => boolean;
	changeDownloadPath: (state: S, newPath: string) => null;
}

export const settingsMutations: MutationTree<State> & SettingsMutations = {
	SetAnimeListView: (state, newAnimeListView) => {
		state.animeListView = newAnimeListView;
	},
	connectSocketIOClient: (state) => {
		const { settingsSocketIOInstance } = state;
		if (!settingsSocketIOInstance) {
			return null;
		}

		return settingsSocketIOInstance.connect();
	},
	disconnectSocketIOClient: (state) => {
		const { settingsSocketIOInstance } = state;
		if (!settingsSocketIOInstance) {
			return null;
		}

		return settingsSocketIOInstance.close();
	},

	toggleOpenOnLocalNetwork: (state) => {
		const { settingsSocketIOInstance } = state;
		if (!settingsSocketIOInstance) {
			throw new Error("SocketIOClient is null");
		}

		settingsSocketIOInstance.emit("toggleOpenOnLocalNetwork");
		return null;
	},

	changeServerPort: (state, newPort) => {
		const { settingsSocketIOInstance } = state;
		if (!settingsSocketIOInstance) {
			throw new Error("SocketIOClient is null");
		}

		settingsSocketIOInstance.emit("changePort", newPort);
		return false;
	},

	changeDownloadPath: (state, newPath) => {
		const { settingsSocketIOInstance } = state;
		if (!settingsSocketIOInstance) {
			throw new Error("SocketIOClient is null");
		}

		settingsSocketIOInstance.emit("changeDownloadPath", newPath);
		return null;
	}

};

export default settingsMutations;

