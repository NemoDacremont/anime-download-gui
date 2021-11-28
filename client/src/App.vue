<template>
	<div class="app-container">
		<nav-element variant="list">
			<div id="top_nav">
				<nav-item path="/" name="Home" />
				<nav-item path="/animelist/vostfr/1" name="Anime List" />
				<nav-item path="/download" name="Downloads" />
				<nav-item path="/about" name="About" />
			</div>
			<div>
				<nav-item path="/settings" icon="settings"/>
			</div>
		</nav-element>

		<main>
			<router-view :key="$route.path"/>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { NavElement, NavItem } from './components/nav';

export default defineComponent({
	name: 'App',
	components: {
		NavElement,
		NavItem
	}
});
</script>

<style lang="scss">

// Material Icons
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(/material-icons.woff2) format('woff2');
}

.material-icons {
  font-family: 'Material Icons', cursive;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  font-feature-settings: 'liga';
  -moz-osx-font-smoothing: grayscale;
}

//	Fonts, Poppins and Montserrat
@font-face {
	font-family: Poppins;
	font-style: normal;
	font-weight: 500;
	src: url(/Poppins-Medium.ttf) format('truetype');
}

@font-face {
	font-family: Montserrat;
	font-style: normal;
	font-weight: 400;
	src: url(/Montserrat-Regular.ttf) format('truetype');
}

:root {
	--background-color-dark: #303335;
	--nav-background-color-dark: #414446;
	--background-color-highlight-dark: #525557;
	--font-color-dark: #f8f8f7;

	--highlight-activable: #728BAB;
	--highlight-active: #FBC02D;
	--highlight-selected: #388E3C;
	--highlight-downloaded: #458233;
	--highlight-not-downloaded: #83322D;
	
	--background-color: var(--background-color-dark);
	--nav-background-color: var(--nav-background-color-dark);
	--background-color-highlight: var(--background-color-highlight-dark);
	--font-color: var(--font-color-dark);
}

.clickable {
	position: relative;
	color: var(--font-color);
	transition: color .25s;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;

	&::selection {
		background-color: transparent;
	}

	&.active {
		color: var(--highlight-active);
	}

	&::before {
		content: '';
		width: 100%;
		height: 100%;

		position: absolute;
		left: 0;
		top: 0;

		background-color: var(--background-color-highlight);
		border-radius: 50%;

		opacity: 0;
		z-index: -1;
		transform: scale(0.5, 0.5);
		transition: opacity .25s, transform .25s;
	}

	&:hover {
		cursor: pointer;
		color: var(--highlight-activable);
		&.active {
			color: var(--highlight-active);
		}

		&::before {
			opacity: .5;
			transform: scale(1, 1);
		}
	}

	&.text {
		padding: .75em 1em;
		display: inline-flex;
		&::before {
			border-radius: .75em;
		}
	}

	&.highlight {
		color: var(--highlight-activable);
	}

	&.medium {
		padding: .5em;
	}
}

*,
*::before,
*::after {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
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

header, footer {
	background-color: var(--nav-background-color);
}

h1 {
	font-family: Poppins, sans-serif;
	font-weight: 600;
}


</style>
