<script lang="ts">
	import { format, addMonths, isSameMonth } from "date-fns";
	import { setIcon } from "obsidian";
	import { onMount } from "svelte";
	import Calendar from "./Calendar.svelte";

	let currentMonth = new Date();
	let prevButtonEl: HTMLButtonElement;
	let nextButtonEl: HTMLButtonElement;

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
</script>

<div class="calendar-widget">
	<div class="calendar-header">
		<div class="nav-controls">
			<button
				bind:this={prevButtonEl}
				on:click={previousMonth}
				class="nav-button"
				aria-label="Previous month"
			></button>
			<button
				bind:this={nextButtonEl}
				on:click={nextMonth}
				class="nav-button"
				aria-label="Next month"
			></button>
		</div>
		<h2>{format(currentMonth, "MMMM yyyy")}</h2>
		<div class="header-actions">
			{#if !isCurrentMonth}
				<button on:click={goToToday} class="today-button">
					Today
				</button>
			{/if}
		</div>
	</div>

	<Calendar
		selectedMonth={currentMonth}
		onDateSelect={(date) => console.log(date)}
	/>
</div>

<style>
	.calendar-widget {
		padding: var(--size-4-4);
		background: var(--background-secondary);
		border-radius: var(--radius-m);
		display: flex;
		flex-direction: column;
		height: fit-content;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--size-4-4);
		gap: var(--size-4-3);
	}

	.nav-controls {
		display: flex;
		gap: var(--size-4-1);
	}

	.header-actions {
		min-width: 72px;
		display: flex;
		justify-content: flex-end;
	}

	.calendar-header h2 {
		font-size: var(--font-ui-large);
		color: var(--text-normal);
		margin: 0;
	}

	.nav-button {
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		color: var(--text-muted);
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-s);
		transition: all 0.15s ease;
	}

	.nav-button:hover {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
		color: var(--text-normal);
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.nav-button:active {
		transform: translateY(0);
		background: var(--background-modifier-active-hover);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.today-button {
		background: var(--interactive-accent);
		border: none;
		color: var(--text-on-accent);
		cursor: pointer;
		font-size: var(--font-ui-small);
		font-weight: 500;
		padding: 6px 12px;
		height: 32px;
		border-radius: var(--radius-s);
		transition: all 0.15s ease;
	}

	.today-button:hover {
		background: var(--interactive-accent-hover);
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
	}

	.today-button:active {
		transform: translateY(0);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}
</style>
