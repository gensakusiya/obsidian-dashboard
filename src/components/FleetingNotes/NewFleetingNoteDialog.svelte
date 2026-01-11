<script lang="ts">
	import type { App } from "obsidian";

	import { noteGroups } from "../../stores/fleeting-notes-store";
	import { getFleetingNotesManager } from "../../fleeting-notes";

	import Button from "../Atoms/Button.svelte";
	import Dialog from "../Atoms/Dialog.svelte";
	import Toolbox from "../Atoms/Toolbox.svelte";
	import Form from "../Atoms/Form.svelte";
	import NewFleetingNoteForm from "./NewFleetingNoteForm.svelte";

	interface DialogProps {
		app: App;
		dialog: HTMLDialogElement;
		defaultGroupName?: string;
	}

	const fleetingNotesManager = getFleetingNotesManager();

	let {
		dialog = $bindable(),
		app = $bindable(),
		defaultGroupName,
	}: DialogProps = $props();
	let note: string = $state("");
	let date: Date | undefined = $state(undefined);
	let fleetingNoteGroup: string[] = $derived($noteGroups);
	let fleetingNoteGroupValue: string = $state(
		defaultGroupName || $noteGroups[0] || "",
	);

	$effect(() => {
		if (defaultGroupName) {
			fleetingNoteGroupValue =
				defaultGroupName || fleetingNoteGroup[0] || "";
		}
	});

	function closeDialog() {
		if (dialog.open) {
			dialog.close();
			note = "";
			date = undefined;
			fleetingNoteGroupValue =
				defaultGroupName || fleetingNoteGroup[0] || "";
		}
	}

	function handleNoteAdded() {
		fleetingNotesManager.createNote(note, fleetingNoteGroupValue, date);
		closeDialog();
	}
</script>

<Dialog bind:dialog onClose={closeDialog} title="Quick Add Note">
	<Form>
		<NewFleetingNoteForm
			bind:note
			bind:date
			bind:fleetingNoteGroup
			bind:fleetingNoteGroupValue
		/>
	</Form>

	{#snippet footer()}
		<Toolbox>
			<Button onClick={closeDialog}>Cancel</Button>
			<Button onClick={handleNoteAdded} variant="primary">Add Note</Button
			>
		</Toolbox>
	{/snippet}
</Dialog>
