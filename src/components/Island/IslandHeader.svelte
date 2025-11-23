<script lang="ts">
	export let title: string;
	export let subtitle: string | null = null;
	export let buttonText: string | null = null;
	export let onButtonClick: (() => void) | null = null;
</script>

<div class="header">
	<div class="content">
		<h3 class="title">{title}</h3>
		{#if subtitle}
			<span class="subtitle">{subtitle}</span>
		{/if}
	</div>
	{#if buttonText && onButtonClick}
		<button on:click={onButtonClick} class="button">
			{buttonText}
		</button>
	{/if}
</div>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--size-4-3);
		padding-bottom: var(--size-4-2);
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: var(--size-4-1);
		flex: 1;
	}

	.title {
		margin: 0;
		font-size: var(--font-ui-medium);
		font-weight: 600;
		color: var(--text-normal);
	}

	.subtitle {
		font-size: var(--font-ui-small);
		color: var(--text-muted);
		font-weight: 500;
	}

	.button {
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		color: var(--text-normal);
		cursor: pointer;
		font-size: var(--font-ui-small);
		font-weight: 500;
		padding: 6px 12px;
		height: 32px;
		border-radius: var(--radius-s);
		transition: all 0.15s ease;
		white-space: nowrap;
	}

	.button:hover {
		background: var(--background-modifier-hover);
		border-color: var(--background-modifier-border-hover);
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.button:active {
		transform: translateY(0);
		background: var(--background-modifier-active-hover);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}
</style>
