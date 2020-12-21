<template>
	<nav class="nav">
		<ul class="nav__routes-list">
			<slot></slot>
		</ul>
	</nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'NavElement'
})
</script>

<style lang="scss">

.nav {
	height: 100%;
	width: 100%;

	padding: 3em 0;

	.nav__routes-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		list-style: none;
	}
}

</style>