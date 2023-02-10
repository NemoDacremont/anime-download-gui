<template>
	<div class="anime-view">
		<div class="content" v-if="anime">
			<header>
				<h1>{{ anime.title }}</h1>
				<div class="selection-type">
					<span class="clickable text submit-selection" @click="submitUnselect" title="Remove from download list">
						Remove selection
					</span>

					<span class="clickable text submit-selection" @click="submitSelect" title="Add to download list">
						Add selection
					</span>
				</div>
			</header>

			<section>
				<div class="episodes" v-if="episodes">
					<div class="top">
						<div class="actions-container">
							<p>Nombre d'épisodes: {{ episodes.length }}</p>
							<div class="actions">
								<span class="clickable text" @click="selectAll" title="Add all episodes to selection">
									select all
								</span>
								<span class="clickable text" @click="unSelectAll" title="Remove all episodes from selection">
									unselect all
								</span>
							</div>
						</div>
						

						<div class="range-selection">
							<div class="inputs">
								<label for="start">
									<input type="number" name="start" id="start"
										min="1"
										:max="episodes.length - 1"
										v-model="startSelection"
									>
								</label>

								<label for="end">
									<input type="number" name="end" id="end"
										min="2"
										:max="episodes.length"
										v-model="endSelection"
									>
								</label>
							</div>

							<div class="submits">
								<span class="clickable text submit-range" title="Add range to selection" @click="selectRange">
									Select Range
								</span>

								<span class="clickable text submit-range" title="Remove range from selection" @click="unSelectRange">
									Unselect Range
								</span>
							</div>
							
							
						</div>
					</div>

					<hr>
					
					<form @submit.prevent>
						<ul class="episode-list">
							<li v-for="(episode, index) in episodes" :key="index">
								<label class="episode-list-item clickable text" @click.prevent="toggle(index + 1)" :class="{ selected: selectedEpisodes.has(index + 1), 'server-selected': serverSelectedEpisodes.has(index + 1) }">
									<span>{{ episode.episode }}</span>
								</label>
							</li>
						</ul>
					</form>
				</div>
			</section>
		</div>

		<div class="loading" v-else>
			Loading..........
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import axios from 'axios';

// in order to use this.$route
// eslint-disable-next-line
import { useRoute } from 'vue-router';

// Store
import { mapGetters, mapActions, useStore } from 'vuex';

// constants / interfaces
import { API_BASE_URL } from '@/constants';
import { Episode } from '@/store/download/downloadTypes';
import { Anime, Version } from '@/store/animeList/animeListTypes';

export default defineComponent({
	name: 'anime-view',
	data () {
		return {
			startSelection: "1",
			endSelection: "2",
			episodes: null as null | Episode[],
			selectedEpisodes: new Set() as Set<number>,
			serverSelectedEpisodes: new Set() as Set<number>,
			isRangeSelectMethod: false
		}
	},
	computed: {
		anime (): Anime {
			const { version, id: idParam } = this.$route.params as { version: Version; id: string };
			const id = parseInt(idParam);

			return this.getAnime(version, id);
		},
		...mapGetters(['getAnime'])
	},
	methods: {
		async loadEpisodes () {
			const { version } = this.$route.params;
			const { id } = this.anime;
			const apiURL = `/animes/episodes/${version}/${id}`;
			const url = API_BASE_URL + apiURL;

			this.$data.episodes = (await axios.get(url)).data;
		},
		toggle (index: number) {
			if (this.$data.selectedEpisodes.has(index)) this.$data.selectedEpisodes.delete(index);
			else this.$data.selectedEpisodes.add(index);
		},
		submitSelect () {
			const { selectedEpisodes, serverSelectedEpisodes } = this.$data;
			const { version, id: animeID } = this.$route.params;

			interface PostData {
				animeID: number;
				version: Version;
				episodes: number[];
			}

			const isAnimeIDValid = typeof animeID === 'string' && !isNaN(parseInt(animeID));
			const isVersionValid = ['vostfr', 'vf'].includes(version as string);

			if (!isAnimeIDValid || !isVersionValid) return;

			const parsedEpisodes = [...selectedEpisodes].sort((a, b) => a - b);


			const postData: PostData = {
				animeID: parseInt(animeID as string),
				version: version as Version,
				episodes: parsedEpisodes
			}

			parsedEpisodes.forEach((episode) => {
				serverSelectedEpisodes.add(episode);
			});

			axios.post(API_BASE_URL + '/download/selectEpisodes', postData);
		},
		submitUnselect () {
			const { selectedEpisodes, serverSelectedEpisodes } = this.$data;
			const { version, id: animeID } = this.$route.params;

			interface PostData {
				animeID: number;
				version: Version;
				episodes?: number[];
			}

			const isAnimeIDValid = typeof animeID === 'string' && !isNaN(parseInt(animeID));
			const isVersionValid = ['vostfr', 'vf'].includes(version as string);

			if (!isAnimeIDValid || !isVersionValid) return;

			const parsedEpisodes = [...selectedEpisodes].sort((a, b) => a - b);
			
			const postData: PostData = {
				animeID: parseInt(animeID as string),
				version: version as Version,
				episodes: selectedEpisodes.size === 0 ? undefined : parsedEpisodes
			}

			parsedEpisodes.forEach((episode) => {
				serverSelectedEpisodes.delete(episode);
			});

			axios.post(API_BASE_URL + '/download/unSelectEpisodes', postData);
		},
		selectAll () {
			const { selectedEpisodes, episodes } = this.$data as { selectedEpisodes: Set<number>; episodes: null | Episode[] };
			if (!episodes) return;
			for (let i=0 ; i<episodes.length ; i++) {
				selectedEpisodes.add(i + 1);
			}
		},
		unSelectAll () {
			const { selectedEpisodes } = this.$data;
			selectedEpisodes.forEach((value) => {
				selectedEpisodes.delete(value);
			});
		},
		selectRange () {
			const { startSelection, endSelection, selectedEpisodes, episodes } = this.$data;
			const start = parseInt(startSelection), end = parseInt(endSelection);

			if (start <= 0 || (episodes && end > episodes.length)) return;

			for (let i=start ; i<=end ; i++) {
				selectedEpisodes.add(i);
			}
		},
		unSelectRange () {
			const { startSelection, endSelection, selectedEpisodes, episodes } = this.$data;
			const start = parseInt(startSelection), end = parseInt(endSelection);

			if (start <= 0 || (episodes && end > episodes.length - 1)) return;

			for (let i=start ; i<=end ; i++) {
				selectedEpisodes.delete(i);
			}
		},
		...mapActions(['loadData'])
	},
	created () {
		const { id: animeID, version } = this.$route.params;
		if (!this.anime) {
			this.loadData(version)
				.then(() => {
					this.loadEpisodes();
				})
		}
		else {
			this.loadEpisodes();
		}

		const versionURL = API_BASE_URL + `/download/getSelectedEpisodes/${animeID}/${version}`;
		axios.get(versionURL).then(res => {
			const selectedEpisodes = res.data;

			if (Array.isArray(selectedEpisodes)) {
				selectedEpisodes.forEach((selectedEpisode) => {
					this.$data.serverSelectedEpisodes.add(selectedEpisode);
				});
			}
		});
	}
})
</script>

<style lang="scss" scoped>

.anime-view {
	height: 100vh;
	position: relative;
	overflow: auto;
}

header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1em 3em;

	.selection-type {
		display: flex;
		align-items: center;
		gap: 2em;
		height: 100%;

		hr {
			height: 1.5em;
			border-left: .1em solid var(--font-color);
		}
	}

	h1 {
		font-size: 1.5em;
	}
}

input[type=number] {
	width: 4em;
}

.episode-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
	grid-auto-rows: auto;
	gap: 1.25em;
	padding: 1.25em;
	list-style: none;

	span {
		font-size: 1.2em;
		font-weight: 500;
		padding: .5em 0;
		transition: color .25s;

		&::selection {
			background-color: transparent;
		}
	}

	.episode-list-item {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 100%;
		background-color: var(--nav-background-color);
		border-radius: .75em;
		transition: background-color .25s;

		&.selected span {
			color: var(--highlight-active);
		}

		&.server-selected {
			background-color: var(--highlight-selected);
			
			/*span {
				//color: var(--background-color);
			}

			&.selected span {
				//color: var(--highlight-actove);
			}*/
		}

		&:hover {
			cursor: pointer;

		}

		input[type=checkbox] {
			visibility: hidden;
			position: absolute;
		}
	}

}

.top {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding: .5em;
}

.actions-container, .range-selection {
	display: flex;
	align-items: center;
	gap: 7.5em;
	justify-content: space-between;

}

.episodes {
	display: flex;
	flex-direction: column;
	align-items: center;

	& > hr {
		width: 75%;
		margin: .25em 0;
	}

	& > form {
		width: 100%;
	}
}

</style>
