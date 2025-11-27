<script lang="ts">
	import Button from "../Atoms/Button.svelte";

	let {
		title,
		subtitle,
		buttonText = "",
		onButtonClick = () => void 0,
		children,
	}: {
		title?: string;
		subtitle?: string;
		buttonText?: string;
		onButtonClick?: () => void;
		children?: () => any;
	} = $props();
</script>

<div class="header">
	{#if children}
		{@render children()}
	{:else}
		<div class="content">
			<h3 class="title">{title}</h3>
			{#if subtitle}
				<span class="subtitle">{subtitle}</span>
			{/if}
		</div>
		{#if buttonText && onButtonClick}
			<Button onClick={onButtonClick} ariaLabel={buttonText}>
				{buttonText}
			</Button>
		{/if}
	{/if}
</div>

<style>
	.header {
		display: flex;
		align-items: center;
		gap: var(--size-4-2);
		padding: var(--size-4-4);
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.title {
		margin: 0;
		font-size: var(--font-ui-medium);
		font-weight: var(--font-weight-semibold);
		color: var(--text-normal);
	}

	.subtitle {
		font-size: var(--font-ui-small);
		color: var(--text-muted);
		font-weight: var(--font-weight-medium);
	}
</style>
