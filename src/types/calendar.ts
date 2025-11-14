export interface DayData {
	date: Date;
	isSelected: boolean;
	isToday: boolean;
}

export interface CalendarMonth {
	year: number;
	month: number;
	daysInMonth: number;
	firstDayOfWeek: number; // 0 (Monday) to 6 (Sunday)
	days: DayData[];
}
