<script lang="ts">
	import type { Snippet } from "svelte";

	interface CheckboxProps {
		checked?: boolean;
		disabled?: boolean;
		ariaLabel?: string;
		className?: string;
		onChange?: (checked: boolean) => void;
		children?: Snippet;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		ariaLabel = "Checkbox",
		className = "",
		onChange = () => void 0,
		children,
	}: CheckboxProps = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		checked = target.checked;
		onChange(checked);
	}
</script>

<label class="checkbox-label {className}" class:disabled>
	<input
		bind:checked
		type="checkbox"
		class="checkbox"
		onchange={handleChange}
		aria-label={ariaLabel}
		{disabled}
	/>
	{#if children}
		<span class="checkbox-text">
			{@render children()}
		</span>
	{/if}
</label>

<style>
	.checkbox-label {
		-webkit-app-region: no-drag;
		display: inline-flex;
		align-items: center;
		gap: var(--size-4-2);
		cursor: var(--cursor);
		user-select: none;
	}

	.checkbox-label.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.checkbox {
		-webkit-app-region: no-drag;
		appearance: none;
		height: var(--checkbox-size);
		width: var(--checkbox-size);
		background: var(--background-modifier-form-field);
		border: var(--input-border-width) solid
			var(--background-modifier-border);
		border-radius: var(--radius-s);
		cursor: var(--cursor);
		outline: none;
		transition:
			background-color var(--anim-duration-fast) ease-in-out,
			border-color var(--anim-duration-fast) ease-in-out,
			box-shadow var(--anim-duration-fast) ease-in-out;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		position: relative;
	}

	.checkbox:hover {
		background-color: var(--background-modifier-form-field-hover);
		border-color: var(--background-modifier-border-hover);
	}

	.checkbox:focus-visible {
		box-shadow: 0 0 0 var(--input-border-width-focus)
			var(--background-modifier-border-focus);
	}

	.checkbox:checked {
		background-color: var(--checkbox-color);
		border-color: var(--checkbox-color);
	}

	.checkbox:checked:hover {
		background-color: var(--checkbox-color-hover);
		border-color: var(--checkbox-color-hover);
	}

	.checkbox:checked::after {
		content: "";
		top: -1px;
		inset-inline-start: -1px;
		position: absolute;
		width: var(--checkbox-size);
		height: var(--checkbox-size);
		display: block;
		background-color: var(--checkbox-marker-color);
	}

	.checkbox:disabled {
		cursor: not-allowed;
	}

	.checkbox-text {
		color: var(--text-normal);
		font-size: var(--font-ui-small);
		font-family: inherit;
	}
</style>
