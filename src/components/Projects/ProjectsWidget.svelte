<script lang="ts">
	import type { App } from "obsidian";
	import { formatDate } from "../../utils/date";
	import { selectedDate } from "../../stores/store";
	import { getAllProjects, type Project } from "../../projects";
	import Island from "../Island/Island.svelte";
	import IslandHeader from "../Island/IslandHeader.svelte";

	export let app: App;

	let projects: Project[] = [];
	let loading = true;
	let error: string | null = null;

	// Load projects on mount
	$: if (app) {
		loadProjects();
	}

	async function loadProjects() {
		loading = true;
		error = null;
		try {
			console.log("[ProjectsWidget] Loading projects...");
			projects = await getAllProjects(app);
		} catch (e) {
			console.error("Failed to load projects:", e);
			error = "Failed to load projects";
			projects = [];
		} finally {
			loading = false;
			console.log("Projects loaded:", projects);
		}
	}

	function handleProjectClick(project: Project) {
		// Future: Open project kanban board
		console.log("Project clicked:", project);
	}

	function handleViewAll() {
		// Future: Implement view all projects functionality
		console.log("View All Projects clicked");
	}
</script>

<Island>
	{#snippet header()}
		<IslandHeader
			title="Projects"
			subtitle={formatDate($selectedDate)}
			buttonText="View All"
			onButtonClick={handleViewAll}
		/>
	{/snippet}

	{#if loading}
		<div class="panel-loading">Loading projects...</div>
	{:else if error}
		<div class="panel-error">{error}</div>
	{:else if projects.length === 0}
		<div class="panel-empty">
			<p>No projects found</p>
			<span class="empty-hint">
				Create a folder in Projects/ with a Kanban.md file
			</span>
		</div>
	{:else}
		<div class="projects-list">
			{#each projects as project (project.name)}
				<button
					class="project-item"
					on:click={() => handleProjectClick(project)}
				>
					<div class="project-content">
						<span class="project-name">{project.name}</span>
						<div class="project-stats">
							{#if project.inProgressCount > 0}
								<span class="stat in-progress">
									{project.inProgressCount} in progress
								</span>
							{/if}
							<span class="stat total">
								{project.taskCount}
								{project.taskCount === 1 ? "task" : "tasks"}
							</span>
						</div>
					</div>
					<div class="project-indicator">
						{#if project.inProgressCount > 0}
							<div class="progress-badge">
								{project.inProgressCount}
							</div>
						{/if}
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

	.projects-list {
		display: flex;
		flex-direction: column;
		gap: var(--size-4-2);
		overflow-y: auto;
		scrollbar-gutter: stable;
	}

	.project-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: fit-content;
		gap: var(--size-4-3);
		padding: var(--size-4-3);
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		border-radius: var(--radius-s);
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: left;
	}

	.project-item:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
		transform: translateX(2px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.project-item:active {
		transform: translateX(0);
		background: var(--background-modifier-active-hover);
	}

	.project-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--size-4-1);
		min-width: 0;
	}

	.project-name {
		font-size: var(--font-ui-small);
		color: var(--text-normal);
		font-weight: 500;
		line-height: 1.4;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.project-stats {
		display: flex;
		gap: var(--size-4-2);
		align-items: center;
		flex-wrap: wrap;
	}

	.stat {
		font-size: var(--font-ui-smaller);
		color: var(--text-muted);
	}

	.stat.in-progress {
		color: var(--interactive-accent);
		font-weight: 500;
	}

	.project-indicator {
		display: flex;
		align-items: center;
		gap: var(--size-4-2);
	}

	.progress-badge {
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		font-size: var(--font-ui-smaller);
		font-weight: 600;
		padding: 4px 8px;
		border-radius: var(--radius-s);
		min-width: 24px;
		text-align: center;
	}
</style>
