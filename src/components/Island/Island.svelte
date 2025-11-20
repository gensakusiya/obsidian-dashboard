<script lang="ts">
	export let title: string = "";
	export let subtitle: string | undefined = undefined;
</script>

<div class="island">
	{#if title || $$slots.header}
		<div class="island-header">
			{#if $$slots.header}
				<slot name="header" />
			{:else}
				<div class="header-content">
					<h3 class="island-title">{title}</h3>
					{#if subtitle}
						<span class="island-subtitle">{subtitle}</span>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<div class="island-content">
		<slot />
	</div>
</div>

<style>
	.island {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: var(--size-4-4);
		background: var(--background-secondary);
		border-radius: var(--radius-m);
	}

	.island-header {
		margin-bottom: var(--size-4-4);
	}

	.header-content {
		display: flex;
		flex-direction: column;
		gap: var(--size-4-1);
		padding-bottom: var(--size-4-2);
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.island-title {
		margin: 0;
		font-size: var(--font-ui-medium);
		font-weight: 600;
		color: var(--text-normal);
	}

	.island-subtitle {
		font-size: var(--font-ui-small);
		color: var(--text-muted);
		font-weight: 500;
	}

	.island-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}
</style>
