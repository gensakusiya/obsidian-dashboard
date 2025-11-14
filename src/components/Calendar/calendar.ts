import type { DayData } from "../../types/calendar";

export interface CalendarDay extends DayData {
	day: number;
	isCurrentMonth: boolean;
}
