
<template>
	<div class="anime-card">
		<div
			class="cover"
		>
			<img
				loading="lazy"
				async
				:src="anime.url_image"
				:alt="`${formattedTitle} cover`"
			>
		</div>

		<div class="title">
			<h2>
				{{ formattedTitle }}
			</h2>
			<p>{{ anime.nb_eps }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'AnimeCard',
	props: {
		anime: {
			type: Object,
			required: true
		}
	},
	data () {
		return {
			title: this.$props.anime.title as string
		}
	},
	computed: {
		formattedTitle (): string {
			return this.$data.title.length > 32
				? `${this.$data.title.slice(0, 31)}...`
				: this.$data.title
		}
	}
});
</script>

<style lang="scss" scoped>

.anime-card {
	display: flex;
	position: relative;
	overflow: hidden;

	width: 100%;

	&.list {
		justify-content: space-between;
		flex-direction: row;
		align-items: center;

		.cover {
			display: none;
		}
	}

	&.grid {
		flex-direction: column;
		align-items: center;

		.cover {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.title {
			width: 100%;
			height: 100px;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			padding: .5em;
		}
	}
	
	border-radius: 4px;
	background-color: var(--nav-background-color);

	transform: translate(0, 0);
	transition: transform .25s;

	&::before {
		content: '';
		position: absolute;
		width: 100%;
		height: .2em;
		border-radius: 0 0 4px 4px;
			
		left: -100%;
		bottom: 0%;
		
		background-color: var(--highlight-activable);

		transform: translateX(0%);
		transition: transform .25s;
	}

	&:hover {
		cursor: pointer;
		transform: translate(-.2em, -.2em);

		&::before {
			transform: translateX(100%);
		}
	}

	h2 {
		font-size: 1.15em;
		font-weight: 400;
		
		
	}

}

</style>