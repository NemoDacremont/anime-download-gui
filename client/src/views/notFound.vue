<template>
	<div class="not-found">
		<h1>404 - Not Found</h1>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	name: '404',

});
</script>

<style lang="scss" scoped>

div.not-found {
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	h1 {
		position: relative;
		transform: translateY(-5em);
	}
}

</style>