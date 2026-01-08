<script lang="ts">
	export interface SelectOption {
		value: string;
		label: string;
	}

	interface SelectProps {
		options: SelectOption[];
		value?: string;
		disabled?: boolean;
		ariaLabel?: string;
		className?: string;
		onChange?: (value: string) => void;
	}

	let {
		value = $bindable(""),
		disabled = false,
		ariaLabel = "Select",
		className = "",
		options,
		onChange = () => void 0,
	}: SelectProps = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		value = target.value;
		onChange(value);
	}
</script>

<select
	bind:value
	class="select dropdown {className}"
	aria-label={ariaLabel}
	onchange={handleChange}
	{disabled}
>
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
