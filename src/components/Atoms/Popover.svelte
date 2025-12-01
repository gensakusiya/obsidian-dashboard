<script lang="ts">
	import { onMount, type Snippet } from "svelte";

	interface PopoverProps {
		targetEl: HTMLElement | undefined;
		children?: Snippet;
		placement?: "top" | "bottom" | "left" | "right";
		offset?: number;
		isOpen?: boolean;
		onClose?: () => void;
	}

	let {
		targetEl,
		children,
		placement = "bottom",
		offset = 8,
		isOpen = $bindable(false),
		onClose = () => {
			isOpen = false;
		},
	}: PopoverProps = $props();

	let popoverEl: HTMLDivElement | undefined = $state();
	let position = $state({ top: 0, left: 0 });

	function updatePosition() {
		if (!targetEl || !popoverEl) return;

		const targetRect = targetEl.getBoundingClientRect();
		const popoverRect = popoverEl.getBoundingClientRect();

		let top = 0;
		let left = 0;

		switch (placement) {
			case "bottom":
				top = targetRect.bottom + offset;
				left =
					targetRect.left +
					targetRect.width / 2 -
					popoverRect.width / 2;
				break;
			case "top":
				top = targetRect.top - popoverRect.height - offset;
				left =
					targetRect.left +
					targetRect.width / 2 -
					popoverRect.width / 2;
				break;
			case "left":
				top =
					targetRect.top +
					targetRect.height / 2 -
					popoverRect.height / 2;
				left = targetRect.left - popoverRect.width - offset;
				break;
			case "right":
				top =
					targetRect.top +
					targetRect.height / 2 -
					popoverRect.height / 2;
				left = targetRect.right + offset;
				break;
		}

		position = { top, left };
	}

	function handleClickOutside(event: MouseEvent) {
		if (
			popoverEl &&
			!popoverEl.contains(event.target as Node) &&
			targetEl &&
			!targetEl.contains(event.target as Node)
		) {
			onClose();
		}
	}

	onMount(() => {
		if (isOpen) {
			updatePosition();
		}
	});

	$effect(() => {
		if (isOpen) {
			updatePosition();
			document.addEventListener("click", handleClickOutside);
			window.addEventListener("resize", updatePosition);
			window.addEventListener("scroll", updatePosition, true);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition, true);
		};
	});
</script>

{#if isOpen}
	<div
		bind:this={popoverEl}
		class="popover"
		style="top: {position.top}px; left: {position.left}px;"
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.popover {
		position: fixed;
		z-index: var(--layer-popover);
		background-color: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		border-radius: var(--radius-m);
		box-shadow: var(--shadow-s);
		padding: var(--size-4-2);
		min-width: 100px;
		max-width: 300px;
	}
</style>
