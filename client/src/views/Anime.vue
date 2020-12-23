<template>
	<div>
		<h1>Anime</h1>
		<div class="anime"
			v-if="anime"
		>
		{{ anime.id }}
		<br>
		{{ anime.title }}

		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

// eslint-disable-next-line
import { useRoute } from 'vue-router';

import { mapGetters, mapActions } from 'vuex';
import { Version } from '../store/animeList';


export default defineComponent({
	name: 'Anime',
	computed: {
		...mapGetters(['getAnime']),
		anime () {
			const { version, id: idParam } = this.$route.params as { version: Version; id: string };
			const id = parseInt(idParam);

			return this.getAnime(version, id);
		},
	},
	methods: {
		...mapActions(['loadData'])
	},
	mounted () {
		const { version } = this.$route.params;
		if (!this.anime) {
			this.loadData(version);
		}
	}
})
</script>

<style lang="scss" scoped>

</style>