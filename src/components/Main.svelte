<script>
	export let message = "Hello from Svelte!";
</script>

<div class="test-component">
	<h1>{message}</h1>
	<p>Svelte is working! 🎉</p>
</div>

<style>
	.test-component {
		padding: 20px;
		border: 1px solid var(--color-base-70);
		border-radius: 8px;
		background: var(--background-secondary);
	}

	h1 {
		color: var(--text-normal);
		margin: 0 0 10px 0;
	}

	p {
		color: var(--text-muted);
	}
</style>
