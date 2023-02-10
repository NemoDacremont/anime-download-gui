<template>
  <div class="home">
		<div class="headers">
			<h1>Home</h1>
		</div>

		<div class="content">
			<News />
		</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import News from '../components/Home';

export default defineComponent({
	components: {
		News
	},
  name: 'Home-view',
});
</script>

<style lang="scss" scoped>
.home {
	height: 100vh;
	width: 100%;

	--header-height: 8%;

	.headers {
		height: var(--header-height);
		padding: 0 5em;
		display: flex;
		background-color: var(--nav-background-color);
		align-items: center;
	}
}

.content {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: 1fr;

	width: 100%;
	height: calc(100% - var(--header-height));

	gap: 1em;
	padding: 1em;

	.news {
		grid-column: 1/5;
	}
}
</style>
