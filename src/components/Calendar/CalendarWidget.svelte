<script lang="ts">
	import { format, addMonths } from "date-fns";
	import Calendar from "./Calendar.svelte";

	let currentMonth = new Date();

	function previousMonth() {
		currentMonth = addMonths(currentMonth, -1);
	}

	function nextMonth() {
		currentMonth = addMonths(currentMonth, 1);
	}
</script>

<div class="calendar-widget">
	<div class="calendar-header">
		<button on:click={previousMonth} class="nav-button">&lt;</button>
		<h2>{format(currentMonth, "MMMM yyyy")}</h2>
		<button on:click={nextMonth} class="nav-button">&gt;</button>
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
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--size-4-4);
	}

	.calendar-header h2 {
		font-size: var(--font-ui-large);
		color: var(--text-normal);
		margin: 0;
	}

	.nav-button {
		background: none;
		border: none;
		color: var(--text-normal);
		cursor: pointer;
		font-size: 18px;
		padding: 0;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-s);
		transition: background-color 0.2s ease;
	}

	.nav-button:hover {
		background: var(--background-modifier-accent);
		color: var(--text-accent);
	}
</style>
