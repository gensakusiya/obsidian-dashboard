<script lang="ts">
	import { setIcon } from "obsidian";
	import type { Snippet } from "svelte";
	import { onMount } from "svelte";

	interface AccordionProps {
		title: string;
		isOpen?: boolean;
		className?: string;
		children?: Snippet;
		actions?: Snippet;
	}

	let {
		title,
		isOpen = $bindable(false),
		className = "",
		children,
		actions,
	}: AccordionProps = $props();

	let iconEl: HTMLDivElement | undefined;

	onMount(() => {
		if (iconEl) {
			setIcon(iconEl, "chevron-right");
		}
	});

	function handleToggle() {
		isOpen = !isOpen;
	}

	function handleKeydown() {
		// toggle();
	}
</script>

<div class="accordion {className}" class:open={isOpen}>
	<div class="header" class:has-actions={actions}>
		<button
			class="toggler"
			aria-expanded={isOpen}
			onclick={handleToggle}
			onkeydown={handleKeydown}
		>
			<div class="icon-container" bind:this={iconEl}></div>
			<div class="title">{title}</div>
		</button>
		{#if actions}
			<div class="actions">
				{@render actions?.()}
			</div>
		{/if}
	</div>

	<div class="accordion-content" aria-hidden={!isOpen}>
		{@render children?.()}
	</div>
</div>

<style>
	.accordion {
		--accordion-content-height: 0px;

		display: flex;
		flex-direction: column;
		border-radius: var(--radius-s);
		background: var(--background-secondary);
		height: fit-content;
	}

	.accordion.open {
		--accordion-content-height: auto;
	}

	.header {
		display: grid;
		align-items: center;

		grid-template-columns: 1fr auto;
	}

	.toggler {
		--toggler-radius: var(--radius-s);

		all: unset;

		display: flex;
		align-items: center;
		gap: var(--size-4-2);
		padding: var(--size-4-2) var(--size-4-3);
		color: var(--text-normal);
		font-size: var(--font-ui-medium);
		font-family: inherit;
		cursor: var(--cursor);
		border-radius: var(--toggler-radius);
		transition: background-color var(--anim-duration-fast) ease-in-out;
	}

	.toggler:hover {
		background-color: var(--background-modifier-hover);
	}

	.icon-container {
		width: var(--size-4-4);
		height: var(--size-4-4);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: var(--icon-opacity);
		color: var(--icon-color);
		flex: 0 0 auto;

		transition: transform 100ms ease-in-out;
	}

	.accordion.open .icon-container {
		transform: rotate(90deg);
	}

	.accordion.open .header:not(.has-actions) .toggler {
		--toggler-radius: var(--radius-s) var(--radius-s) 0 0;
	}

	.accordion.open .header.has-actions .toggler {
		--toggler-radius: var(--radius-s) 0 0 0;
	}

	.title {
		font-weight: var(--font-weight-medium);
	}

	.accordion-content {
		height: var(--accordion-content-height);
		transition: height 0.25s;
		overflow: clip;
	}

	.accordion.open .accordion-content {
		padding: var(--size-4-2) 0;
	}
</style>
