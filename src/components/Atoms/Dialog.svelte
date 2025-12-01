<script lang="ts">
	import { setIcon } from "obsidian";
	import { onMount, type Snippet } from "svelte";
	import Button from "./Button.svelte";

	interface DialogProps {
		title: string;
		dialog: HTMLDialogElement;
		onClose: () => void;
		footer?: Snippet;
		children?: Snippet;
	}

	let {
		title = "",
		dialog = $bindable(),
		onClose = () => {
			dialog.close();
		},
		footer,
		children,
	}: DialogProps = $props();

	let closeButtonEl: HTMLButtonElement | undefined = $state();

	onMount(() => {
		if (closeButtonEl) {
			setIcon(closeButtonEl, "cross");
		}
	});
</script>

<dialog bind:this={dialog}>
	<div class="header">
		<h3 id="title" class="title">{title}</h3>
		<Button
			bind:buttonEl={closeButtonEl}
			onClick={onClose}
			variant="badge"
			ariaLabel="Close dialog"
		></Button>
	</div>
	<div class="content">
		{@render children?.()}
	</div>
	{#if footer}
		<div class="footer">
			{@render footer()}
		</div>
	{/if}
</dialog>

<style>
	dialog {
		box-shadow: var(--shadow-l);
		background-color: var(--modal-background);
		border-radius: var(--modal-radius);
		border: var(--modal-border-width) solid var(--modal-border-color);
		padding: 0;
		position: relative;
		min-height: 100px;
		width: var(--dialog-width);
		max-width: var(--dialog-max-width);
		max-height: var(--dialog-max-height);
		overflow: auto;
	}

	dialog[open] {
		display: flex;
		flex-direction: column;
	}

	dialog::backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		backdrop-filter: blur(2px);
	}

	.header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		border-bottom: 1px solid var(--background-modifier-border);
	}

	.title {
		font-size: var(--font-ui-large);
		margin-left: auto;
		margin-right: auto;
		font-weight: var(--font-semibold);
		text-align: start;
		line-height: var(--line-height-tight);
		margin: 0;
	}

	.content {
		display: flex;
		flex-direction: column;
	}

	.footer {
		display: flex;
		gap: var(--size-4-2);
		border-top: 1px solid var(--background-modifier-border);
		justify-content: flex-end;
	}

	.header,
	.content,
	.footer {
		padding: var(--size-4-4);
	}
</style>
