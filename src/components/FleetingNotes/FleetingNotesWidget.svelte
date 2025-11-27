<script lang="ts">
	import type { App } from "obsidian";
	import type { FleetingNote } from "../../types/fleeting-note";
	import { selectedDate } from "../../stores/store";
	import { getNotesForDate } from "../../fleeting-notes";
	import { formatDate } from "../../utils/date";
	import Island from "../Island/Island.svelte";
	import IslandHeader from "../Island/IslandHeader.svelte";

	export let app: App;

	let tasks: FleetingNote[] = [];
	let loading = true;
	let error: string | null = null;

	// Reactive statement to reload tasks when selectedDate changes
	$: if ($selectedDate) {
		loadNotes($selectedDate);
	}

	async function loadNotes(date: Date) {
		loading = true;
		error = null;
		try {
			tasks = await getNotesForDate(app, date);
		} catch (e) {
			console.error("Failed to load notes:", e);
			error = "Failed to load notes";
			tasks = [];
		} finally {
			loading = false;
		}
	}

	function handleTaskClick(task: FleetingNote) {
		// Future: Open note file or edit note
		console.log("Note clicked:", task);
	}

	async function handleOpenAllNotes() {
		// Open or reveal the Fleeting Notes view
		await app.workspace.getLeaf(false).setViewState({
			type: "fleeting-notes-view",
			active: true,
		});
	}
</script>

<Island>
	{#snippet header()}
		<IslandHeader
			title="Fleeting Notes"
			subtitle={formatDate($selectedDate)}
			buttonText="View All"
			onButtonClick={handleOpenAllNotes}
		/>
	{/snippet}

	{#if loading}
		<div class="panel-loading">Loading notes...</div>
	{:else if error}
		<div class="panel-error">{error}</div>
	{:else if tasks.length === 0}
		<div class="panel-empty">
			<p>No notes for this date</p>
			<span class="empty-hint">
				Add notes to your Inbox or create dated notes
			</span>
		</div>
	{:else}
		<div class="fleeting-notes">
			{#each tasks as task (task.id)}
				<button
					class="fleeting-note"
					on:click={() => handleTaskClick(task)}
				>
					<div class="note-checkbox">
						<input type="checkbox" disabled />
					</div>
					<div class="note-content">
						<span class="note-title">{task.title}</span>
						<span class="note-source">{task.source}</span>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</Island>

<style>
	.panel-loading,
	.panel-error,
	.panel-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		color: var(--text-muted);
		font-size: var(--font-ui-small);
		text-align: center;
		padding: var(--size-4-4);
	}

	.panel-error {
		color: var(--text-error);
	}

	.panel-empty p {
		margin: 0 0 var(--size-4-2) 0;
		color: var(--text-normal);
	}

	.empty-hint {
		font-size: var(--font-ui-smaller);
		color: var(--text-faint);
	}

	.fleeting-notes {
		display: flex;
		flex-direction: column;
		gap: var(--size-4-2);
		overflow-y: auto;
		/* Prevent content jumping by reserving space for scrollbar */
		scrollbar-gutter: stable;
	}

	.fleeting-note {
		display: flex;
		align-items: flex-start;
		gap: var(--size-4-2);
		height: fit-content;
		padding: var(--size-4-3);
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		border-radius: var(--radius-s);
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
	}

	.fleeting-note:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
		transform: translateX(2px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.fleeting-note:active {
		transform: translateX(0);
		background: var(--background-modifier-active-hover);
	}

	.note-checkbox {
		display: flex;
		align-items: center;
		margin-top: 2px;
	}

	.note-checkbox input[type="checkbox"] {
		cursor: pointer;
		width: 18px;
		height: 18px;
	}

	.note-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--size-4-1);
		min-width: 0;
	}

	.note-title {
		font-size: var(--font-ui-small);
		color: var(--text-normal);
		line-height: 1.4;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.note-source {
		font-size: var(--font-ui-smaller);
		color: var(--text-muted);
		font-weight: 500;
	}
</style>
