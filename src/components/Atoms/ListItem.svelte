<script lang="ts" generics="T = unknown">
	import type { Snippet } from "svelte";

	interface ListItemProps<T = unknown> {
		item: T;
		className?: string;
		onClick?: (item: T) => void;
		children?: Snippet<[T]>;
	}

	let {
		item,
		className = "",
		onClick,
		children,
	}: ListItemProps<T> = $props();

	function handleClick() {
		onClick?.(item);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onClick?.(item);
		}
	}
</script>

<li
	class="item {className}"
	role="option"
	aria-selected="false"
	tabindex="-1"
	onclick={handleClick}
	onkeydown={handleKeydown}
>
	{@render children?.(item)}
</li>

<style>
	.item {
		padding: var(--size-4-1) var(--size-4-2);
		margin-bottom: 0;
		user-select: none;
		cursor: var(--cursor);
		font-size: calc(var(--font-ui-small) + 1px);
		border-radius: var(--radius-s);
	}

	.item:hover {
		background-color: var(--background-modifier-hover);
	}

	.item:active {
		background-color: var(--background-modifier-active-hover);
	}
</style>
