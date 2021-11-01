
<template>
	<router-link 
		:to="link"
		class="anime-card"
	>
		<div class="cover">
			<img
				loading="lazy"
				async
				:src="anime.url_image"
				:alt="`${formattedTitle} cover`"
			>
		</div>

		<div class="details">
			<div class="title">
				<h2>
					{{ formattedTitle }}
				</h2>
			</div>
			<div class="infos">
				<p>{{ anime.nb_eps }}</p>
			</div>
		</div>
	</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Anime } from '@/store/animeList/animeListTypes';

// eslint-disable-next-line
import { useRoute } from 'vue-router';

export default defineComponent({
	name: 'AnimeCard',
	props: {
		anime: {
			type: Object,
			required: true
		}
	},
	computed: {
		title (): string {
			const anime = this.anime as Anime;

			if (anime.title_english) return anime.title_english;
			if (anime.title_romanji) return anime.title_romanji;
			if (anime.title) return anime.title;

			return 'unnamed';
		},
		formattedTitle (): string {
			return this.title.length > 32
				? `${this.title.slice(0, 31)}...`
				: this.title
		},
		link (): string {
			const { version } = this.$route.params;
			const { id } = this.$props.anime as Anime;
			if (!id) return '#';

			return `/anime/${version}/${id}`;
		}
	}
});
</script>

<style lang="scss" scoped>

.anime-card {
	display: flex;
	position: relative;
	overflow: hidden;
	color: var(--font-color);

	width: 100%;

	&.list {
		justify-content: space-between;
		align-items: center;

		padding: .5em;

		.cover {
			display: none;
		}

		.details {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	&.grid {
		flex-direction: column;
		align-items: center;

		.cover {
			width: 100%;
			height: 300px;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.details {
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
	transition: transform .25s, color .25s;

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
		color: var(--highlight-activable);

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
