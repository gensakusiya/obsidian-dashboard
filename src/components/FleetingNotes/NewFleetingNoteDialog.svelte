<script lang="ts">
	import type { App } from "obsidian";

	import Button from "../Atoms/Button.svelte";
	import Dialog from "../Atoms/Dialog.svelte";
	import Toolbox from "../Atoms/Toolbox.svelte";
	import Form from "../Atoms/Form.svelte";
	import NewFleetingNoteForm from "./NewFleetingNoteForm.svelte";

	interface DialogProps {
		app: App;
		dialog: HTMLDialogElement;
		onCreate: (title: string, date?: Date) => void;
	}

	let {
		dialog = $bindable(),
		app = $bindable(),
		onCreate,
	}: DialogProps = $props();
	let note: string = $state("");
	let date: Date | undefined = $state(undefined);

	function closeDialog() {
		if (dialog.open) {
			dialog.close();
			note = "";
			date = undefined;
		}
	}

	function handleNoteAdded() {
		onCreate(note, date);
		closeDialog();
	}
</script>

<Dialog bind:dialog onClose={closeDialog} title="Quick Add Note">
	<Form>
		<NewFleetingNoteForm bind:note bind:date />
	</Form>

	{#snippet footer()}
		<Toolbox>
			<Button onClick={closeDialog}>Cancel</Button>
			<Button onClick={handleNoteAdded} variant="primary">Add Note</Button
			>
		</Toolbox>
	{/snippet}
</Dialog>
