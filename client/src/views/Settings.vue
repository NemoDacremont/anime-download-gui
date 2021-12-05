<template>
	<div class="settings">
		<div class="headers">
			<h1>Settings</h1>
		</div>




	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: "Settings"
});
</script>

<style scoped>

.headers {
	height: 8vh;
	padding: 0 5em;
	display: flex;
	background-color: var(--nav-background-color);
	align-items: center;
}
</style>
