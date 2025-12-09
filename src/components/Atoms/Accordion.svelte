<script lang="ts">
	import { setIcon } from "obsidian";
	import type { Snippet } from "svelte";
	import { onMount } from "svelte";

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
	<button
		class="header"
		aria-expanded={isOpen}
		onclick={handleToggle}
		onkeydown={handleKeydown}
	>
		<div class="icon-container" bind:this={iconEl}></div>
		<div class="title">{title}</div>
	</button>
	<div class="accordion-content" aria-hidden={!isOpen}>
		{@render children?.()}
	</div>
</div>

<style>
	.accordion {
		--accordion-content-height: 0px;

		display: flex;
		flex-direction: column;
		flex: 0 0 auto;
		border-radius: var(--radius-s);
		background: var(--background-secondary);
	}

	.accordion.open {
		--accordion-content-height: auto;
	}

	.header {
		all: unset;

		display: flex;
		align-items: center;
		gap: var(--size-4-2);
		padding: var(--size-4-2) var(--size-4-3);
		color: var(--text-normal);
		font-size: var(--font-ui-small);
		font-family: inherit;
		cursor: var(--cursor);
		border-radius: var(--radius-s);
		transition: background-color var(--anim-duration-fast) ease-in-out;
	}

	.header:hover {
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

	.title {
		font-weight: var(--font-weight-medium);
	}

	.accordion-content {
		height: var(--accordion-content-height);
		transition: height 0.25s;
		overflow: clip;
	}
</style>
