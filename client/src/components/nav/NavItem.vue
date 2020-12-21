<template>
	<li class="nav-item">
		<router-link :to="path">
			{{ name }}
		</router-link>
	</li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	name: 'NavItem',
	props: {
		name: {
			type: String
		},
		path: {
			type: String
		}
	}
})
</script>

<style lang="scss">

.nav-item {
	width: 100%;

	display: flex;
	justify-content: center;

	a {
		color: var(--highlight-activable);

		display: flex;
		justify-content: center;
		align-items: center;

		width: 60%;

		padding: 1em 0;

		border-radius: 4px;

		font-size: 1.2em;
		font-weight: 600;

		transition: background-color .25s, color .25s;

		&.router-link-exact-active {
			color: var(--highlight-active);
		}

		&:hover {
			background-color: var(--background-color-highlight);
		}
	}
}

</style>