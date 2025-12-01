<script lang="ts">
	import Button from "../Atoms/Button.svelte";
	import Dialog from "../Atoms/Dialog.svelte";
	import Toolbox from "../Atoms/Toolbox.svelte";
	import Form from "../Atoms/Form.svelte";
	import NewFleetingNoteForm from "./NewFleetingNoteForm.svelte";

	interface DialogProps {
		dialog: HTMLDialogElement;
	}

	let { dialog = $bindable() }: DialogProps = $props();
	let note: string = $state("");
	let date: Date | undefined = $state(undefined);

	function closeDialog() {
		if (dialog.open) {
			dialog.close();
			note = "";
		}
	}

	function handleNoteAdded() {
		// Logic to handle adding the note
		console.log("Note added:", note);
		// closeDialog();
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
