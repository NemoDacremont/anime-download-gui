<template>
	<div class="app-container">
		<header>
			<nav-element>
				<nav-item path="/" name="Home" />
				<nav-item path="/animelist/vostfr/1" name="Anime List" />
				<nav-item path="/about" name="About" />
			</nav-element>
		</header>

		<main>
			<router-view/>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { NavElement, NavItem } from './components/nav';

export default defineComponent({
	name: 'App',
	components: {
		NavElement,
		NavItem
	}
})
</script>

<style lang="scss">

:root {
	--background-color-dark: #303335;
	--nav-background-color-dark: #414446;
	--background-color-highlight-dark: #525557;
	--font-color-dark: #f8f8f7;

	--highlight-activable: #728BAB;
	--highlight-active: #f3745c;
	
	--background-color: var(--background-color-dark);
	--nav-background-color: var(--nav-background-color-dark);
	--background-color-highlight: var(--background-color-highlight-dark);
	--font-color: var(--font-color-dark);
}

*,
*::before,
*::after {
	padding: 0;
	margin: 0;
  font-family: Montserrat, sans-serif;
}

body {
	overflow: hidden;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  color: var(--font-color);
	background-color: var(--background-color);
}

a {
	color: var(--highlight-activable);
	text-decoration: none;

	&.router-link-exact-active {
		color: var(--highlight-active);
	}
}

header {
	background-color: var(--nav-background-color);
}

nav {
	display: flex;
	flex-direction: column;

}

.app-container {
	display: grid;
	grid-template-columns: 1fr 4fr;
	grid-template-rows: 1fr;
	gap: 1px;

	height: 100vh;
	width: 100vw;
}


</style>
