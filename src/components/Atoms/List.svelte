<script lang="ts" generics="T = unknown">
	import type { Snippet } from "svelte";
	import type { ClassValue } from "svelte/elements";
	import ListItem from "./ListItem.svelte";

	interface ListProps<T = unknown> {
		className?: ClassValue | undefined | null;
		itemClassName?: ClassValue | undefined | null;
		items: T[];
		onItemClick?: (item: T) => void;
		renderItem?: Snippet<[T]>;
	}

	let {
		className = "",
		itemClassName = "",
		items,
		onItemClick,
		renderItem,
	}: ListProps<T> = $props();
</script>

<ul class="list {className}" role="listbox">
	{#each items as item}
		<ListItem {item} onClick={onItemClick} className={itemClassName}>
			{#snippet children(passedItem)}
				{#if renderItem}
					{@render renderItem(passedItem)}
				{:else}
					{passedItem}
				{/if}
			{/snippet}
		</ListItem>
	{/each}
</ul>

<style>
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--size-2-1);
	}
</style>
