<template>
	<nav class="nav">
		<ul
			class="nav__routes-list"
			:class="variantClass"
		>
			<slot></slot>
		</ul>
	</nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'NavElement',
	props: {
		variant: {
			type: String,
			validator (value: string) {
				return ['grid', 'list'].includes(value);
			}
		}
	},
	computed: {
		variantClass () {
			const { variant } = this.$props as { variant: 'grid' | 'list' | undefined };
			return variant && variant === 'list'
				? 'list'
				: 'grid'
		}
	}
})
</script>

<style lang="scss">

.nav {
	height: 100%;
	width: 100%;

	background-color: var(--nav-background-color);

	padding: 5em 0;

	.nav__routes-list {
		&.list {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		&.grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
			grid-template-rows: auto;
		}
		
		gap: .25em;

		list-style: none;
	}
}

</style>