<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children?: Snippet } = $props();
</script>

<div class="form">
	{@render children?.()}
</div>

<style>
	.form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		gap: var(--size-4-3);
	}
</style>
