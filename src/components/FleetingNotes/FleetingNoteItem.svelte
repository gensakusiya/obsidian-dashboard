<script lang="ts">
	import type { FleetingNote } from "../../types/fleeting-note";

	interface FleetingNoteProps {
		note: FleetingNote;
	}

	let { note }: FleetingNoteProps = $props();
</script>

<div class="fleeting-note">
	<span class="title">{note.title}</span>
	{#if note.date}
		<span class="date">{note.date}</span>
	{/if}
</div>

<style>
	.fleeting-note {
		display: flex;
		flex-direction: column;
		gap: var(--size-2-2);
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
		line-height: var(--line-height-tight);
	}
</style>
