<template>
	<div>
		<header>
			<h1>Download</h1>
		</header>

		<main>
			<div class="list" v-if="downloadList">
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
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

import SelectedAnime from '../components/download/selectedAnime.vue';

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
	async created () {
		this.$data.downloadList = (await axios.get('http://localhost:8080/api/download/getSelectedEpisodes')).data;
		this.$data.socket = io('http://localhost:8080/');
		const { socket } = this.$data;

		socket.on('connect', function() {
			console.log('connected')
		});
		socket.on('test', (data: string) => {
			console.log(data);
		});

		socket.on('downloadData', (data: unknown) => {
			console.log(data);
		});
	},
	beforeUnmount () {
		const { socket } = this.$data;
		if (socket) socket.disconnect();
		console.log('socket should be closed');
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