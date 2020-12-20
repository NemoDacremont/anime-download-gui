<template>
	<div class="anime-list">
		<h1>AnimeList</h1>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'AnimeList',
	props: {

	},
	data () {

	}
});
</script>

<style lang="scss" scoped>

</style>