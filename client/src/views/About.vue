<template>
  <div class="about">
		<div class="headers">
			<h1>About</h1>
		</div>
		<div class="content">
			<h2>Here you will find credits for technologies and things used in this project</h2>
			<ul>

				<li>Backend: Node.js with express.js</li>
				<li>Frontend: Vue.js</li>
				<li>Both use socketio</li>
				<li>I'm using ffmpeg to download files like m3u8 playlists</li>
				<li>Animes are downloaded from neko-sama.fr streaming website</li>

			</ul>
		</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'About-view'
});
</script>

<style lang="scss" scoped>
.headers {
	height: 8vh;
	padding: 0 5em;
	display: flex;
	background-color: var(--nav-background-color);
	align-items: center;
}

.content {
	padding: 1em;
	display: flex;
	flex-direction: column;
	gap: .5em;
	justify-content: center;
	align-items: center;
}

ul {
	width: 70%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

</style>
