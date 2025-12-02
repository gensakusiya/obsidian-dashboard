<script lang="ts">
	import Button from "./Button.svelte";
	import type { Snippet } from "svelte";

	interface ToggleButtonProps {
		buttonEl?: HTMLButtonElement | undefined;
		ariaLabel?: string;
		variant?: "default" | "badge" | "primary";
		pressed?: boolean;
		onToggle?: (pressed: boolean) => void;
		children?: Snippet;
	}

	let {
		buttonEl = $bindable(),
		ariaLabel = "Toggle Button",
		variant = "default",
		pressed = $bindable(false),
		onToggle = () => void 0,
		children,
	}: ToggleButtonProps = $props();

	function handleClick() {
		pressed = !pressed;
		onToggle(pressed);
	}
</script>

<Button
	bind:buttonEl
	{ariaLabel}
	{variant}
	onClick={handleClick}
	ariaPressed={pressed}
	className={pressed ? "toggled" : ""}
>
	{@render children?.()}
</Button>

<style>
	:global(.button.toggled) {
		background-color: var(--interactive-hover);
		box-shadow: var(--input-shadow-hover);
	}

	:global(.button.badge.toggled) {
		box-shadow: none;
		color: var(--icon-color-hover);
		opacity: var(--icon-opacity-hover);
		background-color: var(--background-modifier-hover);
	}

	:global(.button.primary.toggled) {
		background-color: var(--interactive-accent-hover);
	}
</style>
