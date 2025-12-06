<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { getFleetingNotesManager } from "../../fleeting-notes";
	import List from "../Atoms/List.svelte";
	import FleetingNote from "./FleetingNote.svelte";

	const manager = getFleetingNotesManager();

	let notes = $state(manager.notes);
	let isLoading = $state(manager.isLoading);
	let error = $state(manager.error);

	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		unsubscribe = manager.subscribe(() => {
			notes = manager.notes;
			isLoading = manager.isLoading;
			error = manager.error;
		});
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<div class="fleeting-notes-page">
	{#if isLoading}
		<p>Loading...</p>
	{:else if error}
		<p class="error">Error: {error}</p>
	{:else if Object.keys(notes).length === 0}
		<p>No fleeting notes found.</p>
	{:else}
		{#each Object.entries(notes) as [groupName, notesInGroup]}
			<h2>{groupName}</h2>
			<List
				items={notesInGroup}
				onItemClick={(note) => console.log("Clicked note:", note)}
			>
				{#snippet renderItem(note)}
					<FleetingNote {note} />
				{/snippet}
			</List>
		{/each}
	{/if}
</div>

<style>
</style>
