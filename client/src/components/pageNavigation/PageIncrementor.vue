<template>
	<router-link
		:to="path"
		@click="go"
	>
	{{ text }}
	</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		version: {
			type: String,
			validator (value: string) {
				return ['previous', 'next'].includes(value);
			}
		},
		baseUrl: {
			type: String,
			validator (value: string) {
				return value.includes('{{newPage}}')
			}
		},
		currentPage: {
			type: Number
		}
	},
	computed: {
		text () {
			const { version } = this.$props as { version: string };

			return version === 'previous'
				? 'Page précédente'
				: 'Page suivante'
		},
		path () {
			const { version, baseUrl, currentPage } = this.$props as { version: string; baseUrl: string; currentPage: number};

			return version === 'previous'
				? baseUrl.replace('{{newPage}}', `${currentPage - 1}`)
				: baseUrl.replace('{{newPage}}', `${currentPage + 1}`)
		},
		/*isShown () {
			const { version } = this.$props;
		}*/
	},
	methods: {
		go () { this.$router.go(0) }
	}
})
</script>