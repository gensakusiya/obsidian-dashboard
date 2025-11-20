<script lang="ts">
	import { format } from "date-fns";
	import type { App } from "obsidian";
	import type { QuickTask } from "../../types/quick-task";
	import { selectedDate } from "../../stores/store";
	import { getTasksForDate } from "../../quick-tasks";
	import Island from "../Island/Island.svelte";

	export let app: App;

	let tasks: QuickTask[] = [];
	let loading = true;
	let error: string | null = null;

	// Reactive statement to reload tasks when selectedDate changes
	$: if ($selectedDate) {
		loadTasks($selectedDate);
	}

	async function loadTasks(date: Date) {
		loading = true;
		error = null;
		try {
			tasks = await getTasksForDate(app, date);
		} catch (e) {
			console.error("Failed to load tasks:", e);
			error = "Failed to load tasks";
			tasks = [];
		} finally {
			loading = false;
		}
	}

	function formatDate(date: Date): string {
		return format(date, "EEEE, MMMM d, yyyy");
	}

	function handleTaskClick(task: QuickTask) {
		// Future: Open task file or edit task
		console.log("Task clicked:", task);
	}
</script>

<Island title="Quick Tasks" subtitle={formatDate($selectedDate)}>
	{#if loading}
		<div class="panel-loading">Loading tasks...</div>
	{:else if error}
		<div class="panel-error">{error}</div>
	{:else if tasks.length === 0}
		<div class="panel-empty">
			<p>No tasks for this date</p>
			<span class="empty-hint"
				>Add tasks to your Inbox or create dated tasks</span
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
