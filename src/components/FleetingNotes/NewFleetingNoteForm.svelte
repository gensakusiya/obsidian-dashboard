<script lang="ts">
	import { addDays, endOfWeek, format, isDate } from "date-fns";

	import Button from "../Atoms/Button.svelte";
	import Input from "../Atoms/Input.svelte";
	import Toolbox from "../Atoms/Toolbox.svelte";
	import Popover from "../Atoms/Popover.svelte";

	interface FormProps {
		note: string;
		date?: Date;
	}

	let { note = $bindable(), date = $bindable() }: FormProps = $props();
	let currentDate = new Date();
	let datePickerEl: HTMLButtonElement | undefined = $state();
	let isDatePickerOpen = $state(false);

	let dateText = $derived(date ? `@${format(date, "PPP")}` : "no date");

	function handleToday() {
		date = currentDate;
	}

	function handleTomorrow() {
		const tomorrow = addDays(currentDate, 1);
		date = tomorrow;
	}

	function handleThisWeek() {
		const endWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
		date = endWeek;
	}

	function handleDateOpen() {
		isDatePickerOpen = true;
	}

	function handleDateClose() {
		isDatePickerOpen = false;
	}
</script>

<Input
	placeholder="Type something..."
	ariaLabel="Quick add input"
	bind:value={note}
/>

<span class="date-text" class:empty={!date}>{dateText}</span>

<Toolbox>
	<Button onClick={handleToday}>Today</Button>
	<Button onClick={handleTomorrow}>Tomorrow</Button>
	<Button onClick={handleThisWeek}>This week</Button>
	<Button onClick={handleDateOpen} bind:buttonEl={datePickerEl}>Date</Button>
</Toolbox>

<Popover
	targetEl={datePickerEl}
	isOpen={isDatePickerOpen}
	onClose={handleDateClose}
>
	<p>Date picker coming soon...</p>
</Popover>

<style>
	.date-text {
		color: var(--text-normal);
		font-size: var(--font-ui-smaller);
		padding-top: var(--size-4-1);
		line-height: var(--line-height-tight);
	}

	.date-text.empty {
		color: var(--text-muted);
	}
</style>
