<template>
	<div class="app-container">
		<nav-element>
			<nav-item path="/" name="Home" />
			<nav-item path="/animelist/vostfr/1" name="Anime List" />
			<nav-item path="/download" name="Downloads" />
			<nav-item path="/about" name="About" />
		</nav-element>

		<main>
			<router-view :key="$route.path"/>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
//import { io } from 'socket.io-client';

import { NavElement, NavItem } from './components/nav';

export default defineComponent({
	name: 'App',
	components: {
		NavElement,
		NavItem
	},
	created () {
		/*const socket = io('http://localhost:8080/');
		socket.on('connect', function() {
			console.log('connected')
		});
		socket.on('test', (data: string) => {
			console.log(data);
		});*/
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
  font-family: 'Material Icons';
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

.clickable {
	position: relative;
	color: var(--font-color);
	transition: color .25s;
	width: 3em;
	height: 3em;
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
		transform: scale(50%, 50%);
		transition: opacity .25s, transform .25s;
	}

	&:hover {
		cursor: pointer;
		color: var(--highlight-activable);
		&.active {
			color: var(--highlight-active);
		}

		&::before {
			opacity: 50%;
			transform: scale(100%, 100%);
		}
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


</style>
