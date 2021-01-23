<template>
	<section class="news">
		<h1>News</h1>

		<ul class="news__episode-list" v-if="news">
			<li v-for="(episode, index) in recentNews" :key="index">
				<router-link :to="episode.url">
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
import { Episode } from '../../store/download';

// Constants
import { API_BASE_URL } from '../../constants';

export default defineComponent({
	name: 'news',
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
			return news?.slice(0, 10);
		}
	},
	async created () {
		this.news = (await axios.get(API_BASE_URL + '/animes/getNews')).data;
	}
});
</script>

<style lang="scss" scoped>

.news {
	width: 22em;
	height: 100%;
	background-color: var(--nav-background-color);

	overflow: hidden;
	padding: 1em;

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
	display: flex;
	flex-direction: column;
	align-items: center;

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

		&:hover {
			background-color: var(--background-color-highlight);
		}
	}
}

</style>