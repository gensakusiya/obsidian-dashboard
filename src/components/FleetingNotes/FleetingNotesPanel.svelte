<script lang="ts">
	import { format } from "date-fns";
	import type { App } from "obsidian";
	import type { FleetingNote } from "../../types/fleeting-note";
	import { selectedDate } from "../../stores/store";
	import { getNotesForDate } from "../../fleeting-notes";
	import Island from "../Island/Island.svelte";

	export let app: App;

	let tasks: FleetingNote[] = [];
	let loading = true;
	let error: string | null = null;

	console.log("FleetingNotesPanel initialized with app:", app);

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

	function formatDate(date: Date): string {
		return format(date, "EEEE, MMMM d, yyyy");
	}

	function handleTaskClick(task: FleetingNote) {
		// Future: Open note file or edit note
		console.log("Note clicked:", task);
	}

	async function openAllNotes() {
		// Open or reveal the Fleeting Notes view
		await app.workspace.getLeaf(false).setViewState({
			type: "fleeting-notes-view",
			active: true,
		});
	}
</script>

<Island>
	<div slot="header" class="panel-header">
		<div class="header-content">
			<h3 class="panel-title">Fleeting Notes</h3>
			<span class="panel-subtitle">{formatDate($selectedDate)}</span>
		</div>
		<button on:click={openAllNotes} class="view-all-button">
			View All
		</button>
	</div>

	{#if loading}
		<div class="panel-loading">Loading notes...</div>
	{:else if error}
		<div class="panel-error">{error}</div>
	{:else if tasks.length === 0}
		<div class="panel-empty">
			<p>No notes for this date</p>
			<span class="empty-hint"
				>Add notes to your Inbox or create dated notes</span
			>
		</div>
	{:else}
		<div class="tasks-list">
			{#each tasks as task (task.id)}
				<button
					class="task-item"
					on:click={() => handleTaskClick(task)}
				>
					<div class="task-checkbox">
						<input type="checkbox" disabled />
					</div>
					<div class="task-content">
						<span class="task-title">{task.title}</span>
						<span class="task-source">{task.source}</span>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</Island>

<style>
	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--size-4-3);
		padding-bottom: var(--size-4-2);
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.header-content {
		display: flex;
		flex-direction: column;
		gap: var(--size-4-1);
		flex: 1;
	}

	.panel-title {
		margin: 0;
		font-size: var(--font-ui-medium);
		font-weight: 600;
		color: var(--text-normal);
	}

	.panel-subtitle {
		font-size: var(--font-ui-small);
		color: var(--text-muted);
		font-weight: 500;
	}

	.view-all-button {
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		color: var(--text-normal);
		cursor: pointer;
		font-size: var(--font-ui-small);
		font-weight: 500;
		padding: 6px 12px;
		height: 32px;
		border-radius: var(--radius-s);
		transition: all 0.15s ease;
		white-space: nowrap;
	}

	.view-all-button:hover {
		background: var(--background-modifier-hover);
		border-color: var(--background-modifier-border-hover);
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.view-all-button:active {
		transform: translateY(0);
		background: var(--background-modifier-active-hover);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

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

	.tasks-list {
		display: flex;
		flex-direction: column;
		gap: var(--size-4-2);
		overflow-y: auto;
		/* Prevent content jumping by reserving space for scrollbar */
		scrollbar-gutter: stable;
	}

	.task-item {
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

	.task-item:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
		transform: translateX(2px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.task-item:active {
		transform: translateX(0);
		background: var(--background-modifier-active-hover);
	}

	.task-checkbox {
		display: flex;
		align-items: center;
		margin-top: 2px;
	}

	.task-checkbox input[type="checkbox"] {
		cursor: pointer;
		width: 18px;
		height: 18px;
	}

	.task-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--size-4-1);
		min-width: 0;
	}

	.task-title {
		font-size: var(--font-ui-small);
		color: var(--text-normal);
		line-height: 1.4;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.task-source {
		font-size: var(--font-ui-smaller);
		color: var(--text-muted);
		font-weight: 500;
	}
</style>
