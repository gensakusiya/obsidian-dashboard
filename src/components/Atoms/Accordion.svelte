<script lang="ts">
	import type { Snippet } from "svelte";

	interface AccordionProps {
		title: string;
		isOpen?: boolean;
		className?: string;
		children?: Snippet;
	}

	let {
		title,
		isOpen = $bindable(false),
		className = "",
		children,
	}: AccordionProps = $props();

	function toggle() {
		isOpen = !isOpen;
	}
</script>

<div class="accordion {className}">
	<button class="accordion-header" onclick={toggle} aria-expanded={isOpen}>
		<span class="accordion-icon" class:open={isOpen}>▶</span>
		<span class="accordion-title">{title}</span>
	</button>
	{#if isOpen}
		<div class="accordion-content">
			{@render children?.()}
		</div>
	{/if}
</div>

<style>
	.accordion {
		border-radius: var(--radius-s);
	}

	.accordion-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: var(--size-4-2);
		padding: var(--size-4-2) var(--size-4-3);
		background: transparent;
		border: none;
		color: var(--text-normal);
		font-size: var(--font-ui-small);
		font-family: inherit;
		cursor: var(--cursor);
		user-select: none;
		text-align: left;
		border-radius: var(--radius-s);
		transition: background-color var(--anim-duration-fast) ease-in-out;
	}

	.accordion-header:hover {
		background-color: var(--background-modifier-hover);
	}

	.accordion-icon {
		display: inline-block;
		transition: transform var(--anim-duration-fast) ease-in-out;
		font-size: 0.75em;
		color: var(--text-muted);
	}

	.accordion-icon.open {
		transform: rotate(90deg);
	}

	.accordion-title {
		font-weight: var(--font-weight-medium);
	}

	.accordion-content {
		padding: var(--size-4-2) var(--size-4-3);
		padding-top: 0;
	}
</style>
