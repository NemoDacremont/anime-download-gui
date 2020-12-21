<template>
  <div class="home">
		<h1>¯\_(ツ)_/¯</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
});
</script>

<style lang="scss" scoped>
.home {
	height: 100%;
	width: 100%;

	display: flex;
	align-items: center;
	justify-content: center;
}

h1 {
	font-size: 92px;
}
</style>
