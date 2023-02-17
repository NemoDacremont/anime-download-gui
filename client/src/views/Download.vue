<template>
	<div class="download">
		<header>
			<h1>Download</h1>

			<div class="download-control-div">
				<span class="material-icons clickable download-control" @click="toggleDownload"
				:title="isDownloading ? 'Stop Downloading': 'Start Downloading'">
					{{ isDownloading ? 'stop': 'save_alt' }}
				</span>

				<span class="material-icons clickable download-control" @click="togglePause"
				:title="'pause'" v-if="isDownloading">
					{{ getDownloadState === "paused" || getDownloadState === "pause" ? 'play': 'pause' }}
				</span>
			</div>

		</header>


		<section>
			<div class="list" v-if="downloadList && Object.entries(downloadList).length">
				<h2 class="download-state">The application {{ isDownloading ? 'is': "isn't" }} downloading</h2>
				<ul class="selected-anime-list">
					<li v-for="(versions, animeID) in downloadList" :key="animeID">
						<ul>
							<li v-for="(episodes, version) in versions" :key="version">
								<SelectedAnime :animeID="animeID.toString()" :selectedVersion="episodes" :version="version"/>
							</li>
						</ul>
					</li>
				</ul>
			</div>

			<div class="no-selection" v-else>
				<p>Nothing is selected, go back to <router-link to="/animelist/vostfr/1" class="clickable text highlight">Anime List</router-link></p>
				<h2>¯\_(ツ)_/¯</h2>
			</div>

		</section>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

import { mapGetters, mapMutations, mapActions } from 'vuex'

import SelectedAnime from '@/components/download/selectedAnime.vue';
import { Progresses } from '@/store/download/downloadTypes';

import { API_BASE_URL, SOCKET_IO_URL } from '@/constants';

interface DownloadViewData{
	downloadList: Progresses | null;
	socket: Socket | null;
}

export default defineComponent({
	name: 'Download-view',
	components: {
		SelectedAnime
	},
	data (): DownloadViewData {
		return {
			downloadList: null,
			socket: null
		}
	},
	computed: {
		...mapGetters(['getProgresses', 'isDownloading', 'getDownloadState'])
	},
	methods: {
		async togglePause(): Promise<void> {
			if (this.getDownloadState === 'paused' || this.getDownloadState === "pause") {
				console.log("resume")
				this.resumeDownload();
			}
			else {
				console.log("pause")
				this.pauseDownload();
			}
			console.log("downloadstate", this.getDownloadState)
		},
		...mapMutations(['updateProgresses', 'forceIsDownloading']),
		...mapActions(['toggleDownload', 'loadDownloadState', 'resumeDownload', 'pauseDownload'])
	},
	async created (): Promise<void> {
		// Force downloader data loading
		axios.get( API_BASE_URL + '/download/getSelectedEpisodes').then((response) => {
			this.downloadList = response.data;
		});

		axios.get(API_BASE_URL + '/download/getProgresses').then((response) => {
			this.updateProgresses(response.data);
		});

		// Setup socketio to sync downloader data
		this.socket = io(SOCKET_IO_URL);

		await this.loadDownloadState();

		if (this.socket) {
			this.socket.on('progress', (data: Progresses) => {
				this.updateProgresses(data);
			});

			this.socket.on('updateDownloadState', (data: boolean) => {
				this.forceIsDownloading(data);
			});

			this.socket.on('updateSelectedAnime', async () => {
				this.downloadList = (await axios.get(API_BASE_URL + '/download/getSelectedEpisodes')).data;
			});
		}
	},
	beforeUnmount () {
		const socket = this.socket;
		if (socket) socket.disconnect();
	}
})
</script>

<style lang="scss" scoped>

.download {
	height: 100vh;
	overflow: auto;
}

header {
	padding: 1em 3em;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

section {
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 1em 3em;
}

ul {
	list-style: none;
}

.selected-anime-list {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 1em;
}

.download-control {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: .5em;
}

.download-state {
	padding: 1em;
}

.download-control-div {
	display: flex;
	flex-direction: row;
	gap: 1em;
}

</style>
