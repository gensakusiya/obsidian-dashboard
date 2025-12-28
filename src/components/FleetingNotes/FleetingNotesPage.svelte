<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import type { FleetingNote } from "../../types/fleeting-note";
	import { getFleetingNotesManager } from "../../fleeting-notes";
	import { getConfigManager } from "../../config";

	import List from "../Atoms/List.svelte";
	import Accordion from "../Atoms/Accordion.svelte";
	import AddIcon from "../Atoms/AddIcon.svelte";
	import FleetingNoteItem from "./FleetingNoteItem.svelte";

	const manager = getFleetingNotesManager();
	const config = getConfigManager();

	let notes = $state(manager.notes);
	let isLoading = $state(manager.isLoading);
	let error = $state(manager.error);
	let groupOrder = $state(config.getConfig().fleetingNotes.groupOrder);

	let unsubscribe: (() => void) | null = null;
	let configUnsubscribe: (() => void) | null = null;

	let grouped = $derived.by(() => {
		const orderedGroups: Record<string, FleetingNote[]> = {};

		for (const groupName of groupOrder) {
			if (notes[groupName]) {
				orderedGroups[groupName] = notes[groupName];
			}
		}

		const remainingGroups: string[] = Object.keys(notes)
			.filter((groupName) => !groupOrder.includes(groupName))
			.sort();

		for (const groupName of remainingGroups) {
			if (!orderedGroups[groupName]) {
				orderedGroups[groupName] = notes[groupName];
			}
		}

		return orderedGroups;
	});

	onMount(() => {
		unsubscribe = manager.subscribe(() => {
			notes = manager.notes;
			isLoading = manager.isLoading;
			error = manager.error;
		});
		configUnsubscribe = config.subscribe(() => {
			groupOrder = config.getConfig().fleetingNotes.groupOrder;
		});
	});

	onDestroy(() => {
		unsubscribe?.();
		configUnsubscribe?.();
	});

	function handlerAddNote(groupName: string) {
		//  manager.addNote(groupName);
		console.log("Add note to group:", groupName);
	}
</script>

<div class="fleeting-notes-page">
	{#if isLoading}
		<p>Loading...</p>
	{:else if error}
		<p class="error">Error: {error}</p>
	{:else if Object.keys(notes).length === 0}
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
						onItemClick={(note) =>
							console.log("Clicked note:", note)}
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
