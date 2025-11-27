<script lang="ts">
	import { onMount } from "svelte";

	export let value: string = "";
	export let placeholder: string = "";
	export let disabled: boolean = false;
	export let autoFocus: boolean = false;
	export let type: string = "text";
	export let ariaLabel: string = "";

	export let onInput: (event: Event) => void = () => {};
	export let onKeydown: (event: KeyboardEvent) => void = () => {};

	let inputElement: HTMLInputElement;

	onMount(() => {
		if (autoFocus && inputElement) {
			inputElement.focus();
		}
	});
</script>

<input
	bind:this={inputElement}
	bind:value
	on:input={onInput}
	on:keydown={onKeydown}
	class="input"
	aria-label={ariaLabel}
	{type}
	{placeholder}
	{disabled}
/>

<style>
	.input {
		-webkit-app-region: no-drag;
		height: var(--input-height);
		background: var(--background-modifier-form-field);
		border: var(--input-border-width) solid
			var(--background-modifier-border);
		color: var(--text-normal);
		font-family: inherit;
		padding: var(--input-padding);
		font-size: var(--font-ui-small);
		border-radius: var(--input-radius);
		outline: none;
	}

	.input:hover {
		background-color: var(--background-modifier-form-field-hover);
		border-color: var(--background-modifier-border-hover);
		transition:
			box-shadow var(--anim-duration-fast) ease-in-out,
			border var(--anim-duration-fast) ease-in-out;
	}

	.input:focus,
	.input:focus-visible {
		box-shadow: 0 0 0 var(--input-border-width-focus)
			var(--background-modifier-border-focus);
	}
</style>
