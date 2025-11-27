<script lang="ts">
	import Layout from "./Layout.svelte";
	import CalendarWidget from "./Calendar/CalendarWidget.svelte";
	import FleetingNotesPanel from "./FleetingNotes/FleetingNotesWidget.svelte";
	import ProjectsWidget from "./Projects/ProjectsWidget.svelte";

	import Dialog from "./Atoms/Dialog.svelte";
	import Input from "./Atoms/Input.svelte";
	import Button from "./Atoms/Button.svelte";
	import Toolbox from "./Atoms/Toolbox.svelte";
	import Form from "./Atoms/Form.svelte";

	export let app;

	let dialogElement: HTMLDialogElement;

	function openQuickAdd() {
		dialogElement.showModal();
	}

	function closeQuickAdd() {
		dialogElement.close();
	}

	function handleNoteAdded() {
		// Refresh widget when note added
		// Could trigger a reload of FleetingNotesPanel here
	}
</script>

<Layout>
	<CalendarWidget slot="calendar" />
	<FleetingNotesPanel slot="fleeting-notes" {app} />
	<ProjectsWidget slot="projects" {app} />
</Layout>

<!-- Floating Action Button -->
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

<Dialog
	bind:dialog={dialogElement}
	onClose={closeQuickAdd}
	title="Quick Add Note"
>
	<Form>
		Simple test content inside dialog.

		<Input placeholder="Type something..." ariaLabel="Quick add input" />
	</Form>

	{#snippet footer()}
		<Toolbox>
			<Button onClick={closeQuickAdd}>Cancel</Button>
			<Button onClick={handleNoteAdded} variant="primary">Add Note</Button
			>
		</Toolbox>
	{/snippet}
</Dialog>

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
