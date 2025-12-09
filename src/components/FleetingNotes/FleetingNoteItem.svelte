<script lang="ts">
	import type { FleetingNote } from "../../types/fleeting-note";

	interface FleetingNoteProps {
		note: FleetingNote;
	}

	let { note }: FleetingNoteProps = $props();
</script>

<div class="fleeting-note">
	<span class="title">{note.title}</span>
	<span class="date">{note.date}</span>
	<small>Source: {note.source}</small>
</div>

<style>
	.fleeting-note {
		display: flex;
		flex-direction: column;
		padding: var(--size-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-1);
		background-color: var(--color-background-secondary);
	}

	.title {
		color: var(--text-normal);
		font-size: var(--font-ui-medium);
		line-height: var(--line-height-tight);
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.date {
		color: var(--text-muted);
		font-size: var(--font-ui-smaller);
		padding-top: var(--size-4-1);
		line-height: var(--line-height-tight);
	}
</style>
