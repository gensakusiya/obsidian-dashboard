<script lang="ts">
	let { children } = $props();
</script>

<form class="form">
	{@render children()}
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		gap: var(--size-4-3);
	}
</style>
