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
				<span class="day-number">{day.day}</span>
				<div class="day-content">
					<!-- Future: Events/activities will go here -->
				</div>
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
		grid-auto-rows: 1fr;
	}

	.day-cell {
		min-height: 80px;
		background: var(--background-primary);
		border: 1px solid var(--background-modifier-border);
		color: var(--text-normal);
		border-radius: var(--radius-s);
		cursor: pointer;
		font-size: var(--font-ui-small);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 6px 8px;
		gap: 4px;
		transition: all 0.15s ease;
	}

	.day-cell:hover:not(:disabled) {
		background: var(--background-modifier-hover);
		border-color: var(--interactive-accent);
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.day-cell:active:not(:disabled) {
		transform: translateY(0);
		background: var(--background-modifier-active-hover);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.day-number {
		font-weight: 500;
		font-size: var(--font-ui-small);
		line-height: 1;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.15s ease;
	}

	.day-content {
		flex: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2px;
		overflow: hidden;
	}

	.day-cell.today .day-number {
		background: var(--interactive-accent);
		color: var(--text-on-accent);
		font-weight: 600;
	}

	.day-cell.today {
		background: var(--background-primary);
	}

	.day-cell.today:hover {
		background: var(--background-modifier-hover);
	}

	.day-cell.selected {
		background: var(--background-secondary);
		border-color: var(--interactive-accent);
	}

	.day-cell.selected .day-number {
		font-weight: 600;
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
