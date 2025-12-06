import { format, parse, isEqual } from "date-fns";
import { DEFAULT_DATE_FORMAT } from "src/consts";

export function formatDate(date: Date): string {
	return format(date, "EEEE, MMMM d, yyyy");
}

export function formatDateToDefault(date: Date): string {
	return format(date, DEFAULT_DATE_FORMAT);
}

export function formatDateToDisplay(date: Date): string {
	return format(date, "MMM d, yyyy");
}

export function parseDateFromString(dateStr: string): Date | null {
	const parsedDate = new Date(dateStr);
	return isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function isSameDate(
	firstDate: string | Date,
	secondDate: string | Date
): boolean {
	const lDate =
		typeof firstDate === "string" ? parseFromString(firstDate) : firstDate;
	const rDate =
		typeof secondDate === "string"
			? parseFromString(secondDate)
			: secondDate;

	return isEqual(lDate, rDate);
}

export function parseFromString(
	date: string,
	pattern: string = DEFAULT_DATE_FORMAT
): Date {
	return parse(date, pattern, new Date());
}
