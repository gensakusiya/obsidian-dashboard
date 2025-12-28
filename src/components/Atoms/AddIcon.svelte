<script lang="ts">
	import { setIcon } from "obsidian";
	import { onMount } from "svelte";

	import Button from "./Button.svelte";

	interface AddIconProps {
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
		ariaLabel = "Add button",
		title = "",
		onClick = () => {},
	}: AddIconProps = $props();

	onMount(() => {
		if (buttonEl) {
			setIcon(buttonEl, "plus");
		}
	});
</script>

<Button bind:buttonEl variant="badge" {className} {ariaLabel} {onClick} {title}
></Button>
