<script lang="ts">
	let { children } = $props();
</script>

<div class="toolbox">
	{@render children()}
</div>

<style>
	.toolbox {
		display: flex;
		align-items: center;
		gap: var(--size-4-2);
	}
</style>
