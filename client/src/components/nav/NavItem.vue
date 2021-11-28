<template>
	<li class="nav-item"
		:class="{ 'icon-style': (!name && icon) }"
	>
		<router-link :to="path">
			<span class="icon material-icons">{{ icon }}</span>
			<span class="name">{{ name }}</span>
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
		},
		icon: {
			type: String
		}
	},
})
</script>

<style lang="scss" scoped>

.nav-item {
	width: 100%;
	&.icon-style {
		width: 8rem;
	}

	display: flex;
	justify-content: center;

	a {
		color: var(--highlight-activable);

		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;

		width: 75%;

		padding: 1em 0;

		border-radius: 4px;

		font-family: Poppins, sans-serif;
		font-size: 1.2em;
		font-weight: 600;

		transition: background-color .25s, color .25s;

		&.router-link-exact-active {
			color: var(--highlight-active);
			&::before {
				background-color: var(--highlight-active);
			}
		}

		&::before {
			content: '';
			height: 100%;
			width: .15em;

			position: absolute;
			background-color: var(--highlight-activable);
			left: 0;
			top: -100%;

			border-radius: 4px 0 0 4px;

			transform: translateY(0);
			transition: transform .25s;
		}

		&:hover {
			background-color: var(--background-color-highlight);

			&::before {
				transform: translateY(100%);
			}
		}
	}
}

</style>
