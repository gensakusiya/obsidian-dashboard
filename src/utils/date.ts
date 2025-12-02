import { format } from "date-fns";

export function formatDate(date: Date): string {
	return format(date, "EEEE, MMMM d, yyyy");
}

export function formatDateToFleetingNote(date: Date): string {
	return format(date, "yyyy-MM-dd");
}

export function formatDateToDisplay(date: Date): string {
	return format(date, "MMM d, yyyy");
}

export function parseDateFromString(dateStr: string): Date | null {
	const parsedDate = new Date(dateStr);
	return isNaN(parsedDate.getTime()) ? null : parsedDate;
}
