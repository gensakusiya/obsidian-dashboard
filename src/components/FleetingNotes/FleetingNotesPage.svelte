<script lang="ts">
	import { getFleetingNotesManager } from "../../fleeting-notes/manager";

	const manager = getFleetingNotesManager();

	let { notes, isLoading, error } = $derived.by(() => ({
		notes: manager.notes,
		isLoading: manager.isLoading,
		error: manager.error,
	}));
</script>

<div class="fleeting-notes-page">
	<div class="page-header">
		<h1>Fleeting Notes</h1>
	</div>
	{#if isLoading}
		<p>Loading...</p>
	{:else if error}
		<p class="error">Error: {error}</p>
	{:else if notes.length === 0}
		<p>No fleeting notes found.</p>
	{:else}
		<ul class="notes-list">
			{#each notes as note}
				<li class="note-item">
					<h2>{note.title}</h2>
					<p>{note.date}</p>
					<small>Source: {note.source}</small>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
</style>
