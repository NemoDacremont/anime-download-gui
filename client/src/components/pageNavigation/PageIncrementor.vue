<template>
	<router-link
		:to="{
			name: 'AnimeList',
			params: {
				version,
				page: newPage
			}
		}"
	>
	{{ text }}
	</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		variant: {
			type: String,
			validator (value: string) {
				return ['previous', 'next'].includes(value);
			}
		}
	},
	data () {
		return {
			...this.$route.params
		}
	},
	computed: {
		text () {
			const { variant } = this.$props as { variant: string };

			return variant === 'previous'
				? 'Page précédente'
				: 'Page suivante'
		},
		newPage () {
			const { variant } = this.$props as { variant: string };
			const { page } = this.$data as { page: string }

			return variant === 'previous'
				? parseInt(page) - 1
				: parseInt(page) + 1
		}
	}
})
</script>

<style lang="scss" scoped>

a {
	transition: background-color .25s;
	padding: .5em 1em;
	border-radius: 4px;

	&:hover {
		background-color: var(--background-color-highlight);
	}
}

</style>