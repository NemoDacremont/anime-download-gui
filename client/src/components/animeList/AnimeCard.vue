
<template>
	<div class="anime-card">
		<h2>
			{{ formattedTitle }}
		</h2>
		<p>{{ anime.nb_eps }}</p>
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
	justify-content: space-between;
	align-items: center;
	position: relative;
	overflow: hidden;

	border-radius: 4px;
	padding: 1em 1.5em;

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