<script lang="ts">
	import type { App } from "obsidian";

	import type { FleetingNote } from "../../types/fleeting-note";
	import { getFleetingNotesManager } from "../../fleeting-notes/manager";
	import { fleetingNotesStore } from "../../stores/fleeting-notes-store";

	import List from "../Atoms/List.svelte";
	import Accordion from "../Atoms/Accordion.svelte";
	import AddIcon from "../Atoms/AddIcon.svelte";
	import FleetingNoteItem from "./FleetingNoteItem.svelte";
	import NewFleetingNoteDialog from "./NewFleetingNoteDialog.svelte";

	interface FleetingNotesPageProps {
		app: App;
	}

	let { app }: FleetingNotesPageProps = $props();
	const fleetingNotesManager = getFleetingNotesManager();

	let dialogElement: HTMLDialogElement = $state(
		document.createElement("dialog"),
	);

	let grouped = $derived($fleetingNotesStore.notes);
	let isLoading = $derived($fleetingNotesStore.isLoading);
	let error = $derived($fleetingNotesStore.error);
	let addToGroup = $state<string | undefined>(undefined);

	function handlerAddNote(groupName: string) {
		addToGroup = groupName;
		dialogElement?.showModal();
	}

	function handleCompleteNote(note: FleetingNote) {
		const updatedNote: Partial<FleetingNote> = {
			completed: !note.completed,
		};
		fleetingNotesManager.updateFleetingNote(note, updatedNote);
	}
</script>

<div class="fleeting-notes-page">
	{#if isLoading}
		<p>Loading...</p>
	{:else if error}
		<p class="error">Error: {error}</p>
	{:else if Object.keys(grouped).length === 0}
		<p>No fleeting notes found.</p>
	{:else}
		<div class="fleeting-notes-groups">
			{#each Object.entries(grouped) as [groupName, notesInGroup]}
				<Accordion title={groupName} isOpen={true}>
					{#snippet actions()}
						<AddIcon
							ariaLabel="Add note"
							title="Add note"
							onClick={() => handlerAddNote(groupName)}
						></AddIcon>
					{/snippet}

					<List
						items={notesInGroup}
						itemClassName="fleeting-notes-li"
						onItemClick={handleCompleteNote}
					>
						{#snippet renderItem(note)}
							<FleetingNoteItem {note} />
						{/snippet}
					</List>
				</Accordion>
			{/each}
		</div>
	{/if}
</div>

<NewFleetingNoteDialog
	bind:dialog={dialogElement}
	{app}
	defaultGroupName={addToGroup}
/>

<style>
	.fleeting-notes-page :global(.fleeting-notes-li) {
		padding-left: var(--size-4-3);
	}

	.fleeting-notes-groups {
		--column-min-width: 250px;
		--column-max-width: 1fr;
		--gap: var(--size-4-4);

		display: grid;
		grid-template-columns: repeat(
			auto-fit,
			minmax(var(--column-min-width), var(--column-max-width))
		);
		gap: var(--gap);
	}

	.fleeting-notes-groups :global(.accordion) {
		break-inside: avoid;
	}

	/* Small screens: 1 column, full width */
	@media (max-width: 768px) {
		.fleeting-notes-groups {
			--column-min-width: 100%;
			--column-max-width: 100%;
		}
	}

	/* Medium screens: 2-3 columns */
	@media (min-width: 769px) and (max-width: 1199px) {
		.fleeting-notes-groups {
			--column-min-width: 250px;
			--column-max-width: 1fr;
		}
	}

	/* Large screens: up to 5 columns */
	@media (min-width: 1200px) {
		.fleeting-notes-groups {
			--column-min-width: max(250px, calc((100% - (var(--gap) * 4)) / 5));
			--column-max-width: 1fr;
		}
	}
</style>
