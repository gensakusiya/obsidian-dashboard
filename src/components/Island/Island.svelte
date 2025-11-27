<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		header,
		children,
	}: {
		header: Snippet;
		children: Snippet;
	} = $props();
</script>

<div class="island">
	{@render header()}

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.island {
		display: flex;
		flex-direction: column;
		height: fit-content;
		background: var(--background-secondary);
		border-radius: var(--radius-m);
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		padding: var(--size-4-4);
	}
</style>
