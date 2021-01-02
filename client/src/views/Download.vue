<template>
	<div>
		<header>
			<h1>Download</h1>
		</header>

		<main>
			<div class="list" v-if="downloadList && Object.entries(downloadList).length">
				<div class="download-control">
					<span class="material-icons">
						save_alt
					</span>
				</div>
				<ul class="selected-anime-list">
					<li v-for="(versions, animeID) in downloadList" :key="animeID">
						<ul>
							<li v-for="(episodes, version) in versions" :key="version">
								<SelectedAnime :animeID="animeID" :selectedVersion="episodes" :version="version"/>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<div class="no-selection" v-else>
				<p>Nothing is selected, go back to <router-link to="/animelist/vostfr/1">Anime List</router-link></p>
				<h2>¯\_(ツ)_/¯</h2>
			</div>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

import { mapGetters, mapMutations, mapActions } from 'vuex'

import SelectedAnime from '../components/download/selectedAnime.vue';
import { Progresses } from '../store/download';

export default defineComponent({
	name: 'Download',
	components: {
		SelectedAnime
	},
	data () {
		return {
			downloadList: null,
			socket: null as Socket | null
		}
	},
	computed: {
		...mapGetters(['getProgresses'])
	},
	methods: {
		...mapMutations(['updateProgresses'])
	},
	async created () {
		this.$data.downloadList = (await axios.get('http://localhost:8080/api/download/getSelectedEpisodes')).data;
		this.$data.socket = io('http://localhost:8080/');
		const { socket } = this.$data;

		socket.on('connect', function() {
			console.log('socket connected')
		});

		socket.on('progress', (data: Progresses) => {
			this.updateProgresses(data);
		});

		socket.on('updateSelectedAnime', async () => {
			this.$data.downloadList = (await axios.get('http://localhost:8080/api/download/getSelectedEpisodes')).data;
		});
	},
	beforeUnmount () {
		const { socket } = this.$data;
		if (socket) socket.disconnect();
		console.log('socket closed');
	}
})
</script>

<style lang="scss" scoped>
header {
	padding: 1em 3em;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

main {
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

</style>