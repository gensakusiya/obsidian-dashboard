<script lang="ts">
	import { addDays, endOfWeek } from "date-fns";

	import Input from "../Atoms/Input.svelte";
	import Toolbox from "../Atoms/Toolbox.svelte";
	import Popover from "../Atoms/Popover.svelte";
	import Button from "../Atoms/Button.svelte";
	import ToggleButton from "../Atoms/ToggleButton.svelte";
	import { DatePreset } from "../../fleeting-notes/consts";
	import { formatDateToDisplay } from "../../utils/date";
	import CrossIcon from "../Atoms/CrossIcon.svelte";
	import Select from "../Atoms/Select.svelte";

	interface FormProps {
		note: string;
		fleetingNoteGroup: string[];
		fleetingNoteGroupValue?: string;
		date?: Date;
	}

	let {
		note = $bindable(),
		fleetingNoteGroup = $bindable(),
		fleetingNoteGroupValue = $bindable(),
		date = $bindable(),
	}: FormProps = $props();
	let currentDate = new Date();
	let datePickerEl: HTMLButtonElement | undefined = $state();
	let isDatePickerOpen = $state(false);
	let datePressed = $state<DatePreset | null>(null);
	let dateText = $derived.by((): string => {
		if (!date) return "no date";

		switch (datePressed) {
			case DatePreset.Today:
				return `Today (${formatDateToDisplay(date)})`;
			case DatePreset.Tomorrow:
				return `Tomorrow (${formatDateToDisplay(date)})`;
			case DatePreset.ThisWeek:
				return `This Week (${formatDateToDisplay(date)})`;
		}

		return formatDateToDisplay(date);
	});

	$effect(() => {
		if (date === undefined) {
			datePressed = null;
		}
	});

	function getDate(pressed: DatePreset | null): Date | undefined {
		switch (pressed) {
			case DatePreset.Today:
				return currentDate;
			case DatePreset.Tomorrow:
				return addDays(currentDate, 1);
			case DatePreset.ThisWeek:
				return endOfWeek(currentDate, { weekStartsOn: 1 });
			default:
				return undefined;
		}
	}

	function handleToday(pressed: boolean) {
		datePressed = pressed ? DatePreset.Today : null;
		date = getDate(datePressed);
	}

	function handleTomorrow(pressed: boolean) {
		datePressed = pressed ? DatePreset.Tomorrow : null;
		date = getDate(datePressed);
	}

	function handleThisWeek(pressed: boolean) {
		datePressed = pressed ? DatePreset.ThisWeek : null;
		date = getDate(datePressed);
	}

	function handleDateOpen() {
		isDatePickerOpen = true;
		datePressed = null;
	}

	function handleDateClose() {
		isDatePickerOpen = false;
	}

	function handleResetDate() {
		date = undefined;
		datePressed = null;
	}
</script>

<Input
	placeholder="Type something..."
	ariaLabel="Quick add input"
	bind:value={note}
/>

<Select
	options={fleetingNoteGroup.map((group) => ({
		value: group,
		label: group,
	}))}
	bind:value={fleetingNoteGroupValue}
	ariaLabel="Fleeting note group select"
/>

<div class="date-display">
	<span class="date-text" class:empty={!date}>{dateText}</span>
	{#if date}
		<CrossIcon
			ariaLabel="Clear date"
			title="Clear date"
			onClick={handleResetDate}
		></CrossIcon>
	{/if}
</div>

<Toolbox>
	<ToggleButton
		ariaLabel="Today button"
		pressed={datePressed === DatePreset.Today}
		onToggle={handleToday}
	>
		Today
	</ToggleButton>
	<ToggleButton
		ariaLabel="Tomorrow button"
		pressed={datePressed === DatePreset.Tomorrow}
		onToggle={handleTomorrow}>Tomorrow</ToggleButton
	>
	<ToggleButton
		ariaLabel="This Week button"
		pressed={datePressed === DatePreset.ThisWeek}
		onToggle={handleThisWeek}
	>
		This Week
	</ToggleButton>
	<Button
		bind:buttonEl={datePickerEl}
		ariaLabel="Date button"
		onClick={handleDateOpen}
	>
		Date
	</Button>
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
		line-height: var(--line-height-tight);
	}

	.date-text.empty {
		color: var(--text-muted);
	}

	.date-display {
		display: flex;
		align-items: center;
		gap: var(--size-4-2);
		height: var(--input-height);
	}
</style>
