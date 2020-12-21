<template>
	<div class="page-navigation">
		<page-incrementor variant="previous" />

		<go-to-page-form />

		<page-incrementor variant="next" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import PageIncrementor from './PageIncrementor.vue';
import GoToPageForm from './GoToPageForm.vue';

export default defineComponent({
	components: {
		PageIncrementor,
		GoToPageForm
	}
})
</script>

<style lang="scss" scoped>

.page-navigation {
	width: 100%;

	padding: 1em;

	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1em;
}

</style>