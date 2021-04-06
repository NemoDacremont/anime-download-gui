<template>
	<div class="new" v-if="data">
		<h3>{{ data.title }} - {{ data.episode }}</h3>
		<img :src="data.url_image" :alt="`${data.title}-${data.episode}`" lazyload>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'new',
	props: {
		data: {
			type: Object,
		}
	}
});
</script>

<style lang="scss">

.new {
	padding: 1em 2em;
	width: 22em;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: .5em;
}

</style>