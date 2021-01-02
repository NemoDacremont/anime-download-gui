<template>
	<div class="selected-anime">
		<div
			v-if="getAnime(version, animeID)"
			class="selected-anime__version-container"
		>
			<div
				class="selected-anime__anime-title"
				title="develop"
				:style="{ '--progress': `${(versionProgress || 0) - 100}%`}"
			>
				<div class="title" @click="toggleWrap">
					<div class="wrapper-container clickable" :class="{ selected: progresses.isWrapped}">
						<span class="material-icons">
							keyboard_arrow_right
						</span>
					</div>
					<h3>{{ getAnime(version, animeID).title }} -- {{ version }}</h3>
				</div>
				<div class="selected-anime__progress">
					<p>
						progress: <span>{{ Math.round(versionProgress) || 0 }}%</span></p>
					<p>
						<span class="material-icons unselect clickable" @click="unSelectVersion()">
							clear
						</span>
					</p>
				</div>
			</div>
		<ul
				class="selected-anime__episodes-list"
				v-show="!progresses.isWrapped"
			>
				<li
					v-for="episode in selectedVersion"
					:key="episode"
					class="selected-anime__episodes-list-item"
					:style="{ '--progress': `${(getEpisodeProgress(animeID, version, episode) || 0) - 100}%`}"
				>
					<p>episode: {{ episode }}</p>

					<div class="selected-anime__progress">
						<p>progress:
							<span>
								{{ getEpisodeProgress(animeID, version, episode) || 0 }}%
							</span>
						</p>
						<p>
							<span class="material-icons unselect clickable" @click="unSelectEpisode(episode)">
								clear
							</span>
						</p>
					</div>
					
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';

import { mapGetters, mapActions } from 'vuex';

interface EpisodeProgress {
	progress: number;
}

interface Progresses {
	episodes: EpisodeProgress[];
	isWrapped: boolean;
	progress: number;
	size: number;
}

export default defineComponent({
	name: 'SelectedAnime',
	props: {
		selectedVersion: {
			type: Object,
			required: true
		},
		animeID: {
			type: String,
			required: true
		},
		version: {
			type: String,
			required: true
		}
	},
	data () {
		return {
			progresses: {} as Progresses
		}
	},
	computed: {
		versionProgress () {
			console.log('update versionprogress');
			const { progresses } = this.$data;
			const { animeID, version } = this.$props;
			if (!progresses || !progresses) return null;

			let totalProgress = 0;
			for (let i=0 ; i<progresses.size ; i++) {
				totalProgress += this.getEpisodeProgress(animeID, version, i) / progresses.size;
			}
			return totalProgress;
		},
		...mapGetters(['getAnime', 'getVersionProgress', 'getEpisodeProgress'])
	},
	methods: {
		toggleWrap () {
			const { progresses } = this.$data;
			progresses.isWrapped = !progresses.isWrapped;
		},
		unSelectVersion () {
			const { animeID, version } = this.$props
			const options = {
				animeID,
				version
			}
			axios.post('http://localhost:8080/api/download/unSelectEpisodes', options);
		},
		unSelectEpisode (episodes: number) {
			const { animeID, version } = this.$props
			const options = {
				animeID,
				version,
				episodes
			}

			console.table(options);
			axios.post('http://localhost:8080/api/download/unSelectEpisodes', options);
		},
		...mapActions(['loadData'])
	},
	created () {
		// cache anime list if it isn't already
		const { animeID, version, selectedVersion } = this.$props;
		if (this.getAnime(version, animeID) === null) {
			this.loadData(version);
		}
		//

		const episodes = selectedVersion;
		const versionEntry = this.$data.progresses = { episodes: [] as EpisodeProgress[], progress: 0, isWrapped: true, size: 0 };
		for (let i=0 ; i<episodes.length ; i++) {
			versionEntry.episodes.push({ progress: Math.random() * 100 });
			versionEntry.size++;
		}
	}
});
</script>

<style lang="scss" scoped>	

ul {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;

	li {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
	}
	list-style: none;
}

.selected-anime {
	width: 100%;
}

.selected-anime__version-list {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1em;
}

.selected-anime__episodes-list {
	display: flex;
	flex-direction: column;
	gap: .25em;
}

.selected-anime__episodes-list-item, .selected-anime__anime-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	position: relative;

	width: 100%;
	z-index: 10;
	overflow: hidden;

	&::before, &::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	&::before {
		z-index: -2;
		background-color: var(--highlight-not-downloaded);
	}

	&::after {
		z-index: -1;
		background-color: var(--highlight-downloaded);
		transform: translate(var(--progress));
		transition: transform .25s;
		
	}
}

.selected-anime__anime-title {
	margin-bottom: .5em;
	padding: 1em;

	.title {
		display: flex;
		align-items: center;
		gap: 1em;
	}
}

.selected-anime__episodes-list-item {
	width: 98%;
	padding: .8em 1em .8em 1.75em;
}

.wrapper-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: .25em;

	span {
		font-size: 1.5em;
		transform: rotate(90deg);
		transition: transform .25s ease-in-out;

		&::selection {
			background-color: transparent;
		}
	}

	&.selected span {
		transform: rotate(0deg);
	}

	&:hover {
		cursor: pointer;

		span {
			transform: translate(15deg);
		}

		&:not(.selected) span {
			transform: rotate(75deg);
		}
	}
}

.unselect {
	padding: .1em;

	&:hover {
		cursor: pointer; 
	}
}

.selected-anime__progress {
	display: flex;
	align-items: center;
	gap: .25em;
}
</style>
