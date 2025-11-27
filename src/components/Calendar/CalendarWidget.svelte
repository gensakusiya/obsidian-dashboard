<script lang="ts">
	import { format, addMonths, isSameMonth } from "date-fns";
	import { setIcon } from "obsidian";
	import { onMount } from "svelte";
	import { selectedDate } from "../../stores/store";
	import Calendar from "./Calendar.svelte";
	import Island from "../Island/Island.svelte";
	import Button from "../Atoms/Button.svelte";
	import IslandHeader from "../Island/IslandHeader.svelte";

	let prevButtonEl: HTMLButtonElement;
	let nextButtonEl: HTMLButtonElement;
	let currentMonth = new Date();

	$: isCurrentMonth = isSameMonth(currentMonth, new Date());

	onMount(() => {
		if (prevButtonEl) {
			setIcon(prevButtonEl, "chevron-left");
		}
		if (nextButtonEl) {
			setIcon(nextButtonEl, "chevron-right");
		}
	});

	function previousMonth() {
		currentMonth = addMonths(currentMonth, -1);
	}

	function nextMonth() {
		currentMonth = addMonths(currentMonth, 1);
	}

	function goToToday() {
		currentMonth = new Date();
	}

	function handleDateSelect(date: Date) {
		selectedDate.update(() => date);
	}
</script>

<Island>
	{#snippet header()}
		<IslandHeader>
			<div class="header">
				<div class="nav-controls">
					<Button
						bind:buttonEl={prevButtonEl}
						onClick={previousMonth}
						variant="badge"
						ariaLabel="Previous month"
					/>
					<Button
						bind:buttonEl={nextButtonEl}
						onClick={nextMonth}
						variant="badge"
						ariaLabel="Next month"
					/>
				</div>
				<h2>{format(currentMonth, "MMMM yyyy")}</h2>
				<div class="actions">
					{#if !isCurrentMonth}
						<Button
							onClick={goToToday}
							variant="primary"
							ariaLabel="Today"
						>
							Today
						</Button>
					{/if}
				</div>
			</div>
		</IslandHeader>
	{/snippet}

	<Calendar selectedMonth={currentMonth} onDateSelect={handleDateSelect} />
</Island>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 1 0;
		gap: var(--size-4-3);
	}

	.nav-controls {
		display: flex;
		gap: var(--size-4-1);
	}

	.actions {
		min-width: 72px;
		display: flex;
		justify-content: flex-end;
	}

	.header h2 {
		font-size: var(--font-ui-large);
		color: var(--text-normal);
		margin: 0;
	}
</style>
