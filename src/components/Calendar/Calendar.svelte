<script lang="ts">
	import {
		getDaysInMonth,
		startOfMonth,
		isSameDay,
		getDay,
		addMonths,
	} from "date-fns";
	import { selectedDate } from "../../stores/store";
	import type { CalendarDay } from "./calendar";

	export let selectedMonth: Date;
	export let onDateSelect: (date: Date) => void;

	let days: CalendarDay[] = [];

	$: {
		const firstDay = startOfMonth(selectedMonth);
		const firstDayOfWeek = getDay(firstDay); // 0 = Sunday, need to adjust to Monday = 0
		const daysInMonth = getDaysInMonth(selectedMonth);
		const startDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Convert to Monday = 0

		const prevMonthDays = startDay;
		const previousMonthDays = getDaysInMonth(addMonths(selectedMonth, -1));

		const previousDays = Array.from(
			{ length: prevMonthDays },
			(_, i) =>
				({
					day: previousMonthDays - prevMonthDays + i + 1,
					isCurrentMonth: false,
					isToday: false,
					isSelected: false,
				}) as CalendarDay,
		);

		const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
			const date = new Date(
				selectedMonth.getFullYear(),
				selectedMonth.getMonth(),
				i + 1,
			);
			return {
				day: i + 1,
				date,
				isCurrentMonth: true,
				isToday: isSameDay(new Date(), date),
				isSelected: isSameDay($selectedDate, date),
			} as CalendarDay;
		});

		const totalCells = previousDays.length + monthDays.length;
		const nextMonthDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
		const nextDays = Array.from(
			{ length: nextMonthDays },
			(_, i) =>
				({
					day: i + 1,
					isCurrentMonth: false,
					isToday: false,
					isSelected: false,
				}) as CalendarDay,
		);

		days = [...previousDays, ...monthDays, ...nextDays];
	}

	function handleDateClick(day: number) {
		const selectedDay = new Date(
			selectedMonth.getFullYear(),
			selectedMonth.getMonth(),
			day,
		);
		onDateSelect(selectedDay);
	}
</script>

<div class="calendar">
	<div class="weekdays">
		{#each ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as day}
			<div class="weekday">{day}</div>
		{/each}
	</div>

	<div class="days-grid">
		{#each days as day, index (index)}
			<button
				class="day-cell"
				class:today={day.isToday}
				class:selected={day.isSelected}
				class:other-month={!day.isCurrentMonth}
				disabled={!day.isCurrentMonth}
				on:click={() => day.isCurrentMonth && handleDateClick(day.day)}
			>
				{day.day}
			</button>
		{/each}
	</div>
</div>

<style>
	.calendar {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: var(--size-4-2);
		margin-bottom: var(--size-4-2);
	}

	.weekday {
		text-align: center;
		color: var(--text-muted);
		font-size: var(--font-ui-small);
		font-weight: 600;
	}

	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: var(--size-4-2);
		flex: 1;
	}

	.day-cell {
		aspect-ratio: 1;
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-accent);
		color: var(--text-normal);
		border-radius: var(--radius-s);
		cursor: pointer;
		font-size: var(--font-ui-medium);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.day-cell:hover:not(:disabled) {
		background: var(--background-modifier-accent);
		border-color: var(--text-accent);
	}

	.day-cell.today {
		background: var(--interactive-accent);
		color: var(--background-primary);
		font-weight: bold;
		box-shadow: 0 0 8px rgba(0, 200, 200, 0.3);
	}

	.day-cell.today:hover {
		background: var(--interactive-accent-hover);
	}

	.day-cell.selected {
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		font-weight: bold;
		border-color: var(--interactive-accent);
	}

	.day-cell.other-month {
		color: var(--text-faint);
		background: transparent;
		cursor: default;
	}

	.day-cell:disabled {
		cursor: default;
	}
</style>
