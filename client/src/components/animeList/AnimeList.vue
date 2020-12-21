<template>
	<div class="anime-list">
		<h1>AnimeList</h1>
		<ol class="anime-list__list">
			<slot></slot>
		</ol>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'AnimeList',
	data () {
		return {
		}
	}
});
</script>

<style lang="scss" scoped>

.anime-list {
		
	.anime-list__list {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		list-style: none;

		padding: 1em;
	}
}

</style>