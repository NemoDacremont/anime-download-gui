
<template>
	<div class="anime-card">
		<h2>
			{{ anime.title }}
		</h2>
		<p>{{ anime.nb_eps }}</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'AnimeCard',
	props: {
		anime: Object
	},
	data () {
		return {

		}
	}
});
</script>

<style lang="scss" scoped>

.anime-card {
	display: flex;
	justify-content: space-between;
}

</style>