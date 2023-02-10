<template>
	<section class="news">
		<h1>News</h1>

		<ul class="news__episode-list" v-if="news">
			<li v-for="(episode, index) in recentNews" :key="index">
				<router-link :to="formatNewURL(episode.url)">
					<new-item :data="episode" />
				</router-link>
			</li>
		</ul>
		<p v-else>Loading</p>
	</section>
</template>

<script lang="ts">
// Dependencies
import { defineComponent } from 'vue';
import axios from 'axios';

// Components
import NewItem from './NewItem.vue';
import { Episode } from '@/store/download/downloadTypes';

// Constants
import { API_BASE_URL } from '@/constants';

export default defineComponent({
	name: 'news-section',
	components: {
		NewItem
	},
	data () {
		return {
			news: [] as Episode[]
		}
	},
	computed: {
		recentNews () {
			const { news } = this.$data as { news: Episode[] | undefined };
			return news?.slice(0, 40);
		}
	},
	methods: {
		formatNewURL (url: string): string {
			const input = url.replace("/anime/info/", "");

			const idMatch = input.match(/\d+/);
			if (!idMatch) return "#";

			const versionMatch = input.match(/(vostfr)|(vf)/);
			if (!versionMatch) return "#";

			const version = versionMatch[0];
			const id = idMatch[0];

			return `/anime/${version}/${id}`;
		}
	},
	async created () {
		this.news = (await axios.get(API_BASE_URL + '/animes/getNews')).data;
		console.table(this.news);
	}
});
</script>

<style lang="scss" scoped>

.news {
	//width: 22em;
	height: 100%;
	background-color: var(--nav-background-color);

	overflow: hidden;
	padding: 1em;

	border-radius: 4px;

	--header-height: 10%;

	h1 {
		display: flex;
		justify-content: center;
		align-items: center;
		height: var(--header-height);
	}
}

.news__episode-list {
	list-style: none;
	/*display: flex;
	flex-direction: column;
	align-items: center;*/
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(22em, 1fr));
	grid-auto-rows: auto;
	gap: 1em;

	width: 100%;
	height: calc(100% - var(--header-height));
	gap: .5em;
	padding: 1em;
	overflow-y: scroll;

	li {
		width: 100%;
		height: 100%;

		border-radius: 4px;

		transition: background-color .25s;

		display: flex;
		justify-content: center;
		align-items: center;

		&:hover {
			background-color: var(--background-color-highlight);
		}
	}
}

</style>
