<template>
	<div class="anime-list">
		<ol class="anime-list__list">
			<slot></slot>
		</ol>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'AnimeList'
});
</script>

<style lang="scss" scoped>

.anime-list {

	&.list {
		.anime-list__list {
			display: flex;
			flex-direction: column;
			gap: 1em;
		}
	}

	&.grid {
		.anime-list__list {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			grid-auto-rows: auto;
			gap: 1em;
		}
	}
		
	.anime-list__list {

		position: relative;

		list-style: none;

		padding: 1em;
	}
}

</style>