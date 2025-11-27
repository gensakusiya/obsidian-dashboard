<script lang="ts">
	import type { Snippet } from "svelte";

	interface ButtonProps {
		buttonEl?: HTMLButtonElement | undefined;
		ariaLabel?: string;
		variant?: "default" | "badge" | "primary";
		onClick?: () => void;
		children?: Snippet;
	}

	let {
		buttonEl = $bindable(),
		ariaLabel = "Button",
		variant = "default",
		onClick = () => void 0,
		children,
	}: ButtonProps = $props();
</script>

<button
	bind:this={buttonEl}
	onclick={onClick}
	class="button"
	class:primary={variant === "primary"}
	class:badge={variant === "badge"}
	aria-label={ariaLabel}
>
	{@render children?.()}
</button>

<style>
	.button {
		-webkit-app-region: no-drag;
		background: var(--background-primary);
		border: 0;
		color: var(--text-normal);
		font-size: var(--font-ui-small);
		font-weight: var(--input-font-weight);
		padding: var(--size-4-1) var(--size-4-3);
		height: var(--input-height);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border-radius: var(--button-radius);
		transition: all 0.15s ease;
		cursor: var(--cursor);
		font-family: inherit;
		outline: none;
		user-select: none;
		white-space: nowrap;
		-electron-corner-smoothing: var(--corner-smoothing);
	}

	.button:hover {
		background-color: var(--interactive-hover);
		box-shadow: var(--input-shadow-hover);
	}

	.button:active {
		background-color: var(--interactive-hover);
		box-shadow: var(--input-shadow-hover);
	}

	.badge {
		background-color: transparent;
		border-radius: var(--clickable-icon-radius);
		color: var(--icon-color);
		opacity: var(--icon-opacity);
		transition: opacity var(--anim-duration-fast) ease-in-out;

		width: var(--input-height);
		height: var(--input-height);

		padding: 0;
		box-shadow: none;
	}

	.badge:hover {
		box-shadow: none;
		color: var(--icon-color-hover);
		opacity: var(--icon-opacity-hover);
		background-color: var(--background-modifier-hover);
	}

	.primary {
		border: none;
		color: var(--text-on-accent);
		background-color: var(--interactive-accent);
	}

	.primary:hover {
		background-color: var(--interactive-accent-hover);
	}
</style>
