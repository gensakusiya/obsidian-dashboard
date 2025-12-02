<script lang="ts">
	import { setIcon } from "obsidian";
	import { onMount } from "svelte";

	import Button from "./Button.svelte";

	interface CrossIconProps {
		buttonEl?: HTMLButtonElement | undefined;
		size?: number;
		className?: string;
		ariaLabel?: string;
		title?: string;
		onClick?: () => void;
	}

	let {
		buttonEl = $bindable(),
		className = "",
		ariaLabel = "Clear date button",
		title = "",
		onClick = () => {},
	}: CrossIconProps = $props();

	onMount(() => {
		if (buttonEl) {
			setIcon(buttonEl, "cross");
		}
	});
</script>

<Button bind:buttonEl variant="badge" {className} {ariaLabel} {onClick} {title}
></Button>
