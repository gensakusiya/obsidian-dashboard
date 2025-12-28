<script lang="ts">
	import Layout from "./Layout.svelte";
	import CalendarWidget from "./Calendar/CalendarWidget.svelte";
	import FleetingNotesPanel from "./FleetingNotes/FleetingNotesWidget.svelte";
	import ProjectsWidget from "./Projects/ProjectsWidget.svelte";

	import NewFleetingNoteDialog from "./FleetingNotes/NewFleetingNoteDialog.svelte";
	import { getFleetingNotesManager } from "../fleeting-notes";

	export let app;

	let dialogElement: HTMLDialogElement;
	const fleetingNotesManager = getFleetingNotesManager();

	function openQuickAdd() {
		dialogElement.showModal();
	}

	function handleCreateNewNote(title: string, date?: Date) {
		fleetingNotesManager.createNote(title, date);
	}
</script>

<Layout>
	<CalendarWidget slot="calendar" />
	<FleetingNotesPanel
		slot="fleeting-notes"
		manager={fleetingNotesManager}
		{app}
	/>
	<ProjectsWidget slot="projects" {app} />
</Layout>

<NewFleetingNoteDialog
	bind:dialog={dialogElement}
	{app}
	onCreate={handleCreateNewNote}
/>

<!-- Temp: Floating Action Button -->
<button class="fab" on:click={openQuickAdd} aria-label="Quick add note">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<line x1="12" y1="5" x2="12" y2="19"></line>
		<line x1="5" y1="12" x2="19" y2="12"></line>
	</svg>
</button>

<style>
	.fab {
		position: fixed;
		bottom: var(--size-4-8);
		right: var(--size-4-8);
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		transition: all 0.2s ease;
		z-index: 100;
	}

	.fab:hover {
		transform: scale(1.1) translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
		background: var(--interactive-accent-hover);
	}

	.fab:active {
		transform: scale(1.05) translateY(0);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.fab svg {
		width: 28px;
		height: 28px;
		stroke-width: 2.5;
	}
</style>
