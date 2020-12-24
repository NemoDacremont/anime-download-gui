<template>
	<div class="anime-view">
		<div class="content" v-if="anime">
			<header>
				<h1>{{ anime.title }}</h1>
				<div class="selection-type">
					<span
						class="material-icons clickable"
						title="list selection"
					>
						library_add
					</span>

					<span
						class="clickable"
						title="range selection"
					>
						range
					</span>
				</div>
			</header>

			<main>
				<div class="episodes" v-if="episodes">
					<p>Nombre d'épisodes: {{ episodes.length }}</p>
					<form 
						@submit.prevent
						class="form__selection"
					>
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

						<input type="submit" value="Select">
					</form>
				</div>
			</main>
		</div>

		<div class="loading" v-else>
			Loading
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import axios from 'axios';

// eslint-disable-next-line
import { useRoute } from 'vue-router';

import { mapGetters, mapActions } from 'vuex';
import { Anime, Version } from '../store/animeList';

// Store
import { API_BASE_URL } from '../constants';

export default defineComponent({
	name: 'Anime',
	data () {
		return {
			startSelection: 1,
			endSelection: 2,
			episodes: null
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
		...mapActions(['loadData'])
	},
	created () {
		const { version } = this.$route.params;
		if (!this.anime) {
			this.loadData(version)
				.then(() => {
					this.loadEpisodes();
				})
		}
		else {
			this.loadEpisodes();
		}
	}
})
</script>

<style lang="scss" scoped>

header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1em 3em;

	.selection-type {
		display: flex;
		align-items: center;
		gap: 2em;

		&:hover {
			cursor: pointer;
		}
	}

	h1 {
		font-size: 1.5em;
	}
}

input[type=number] {
	width: 4em;
}

</style>