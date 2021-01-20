<template>
	<section class="news">
		<h1>News</h1>
		<new-item />
	</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import newItem from './NewItem.vue';

export default defineComponent({
	name: 'news'
});
</script>

<style lang="scss">

</style>