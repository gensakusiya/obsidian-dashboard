import type { FleetingNote } from "../types/fleeting-note";

export function applySortingToNotes(
	notes: Record<string, FleetingNote[]>,
	groupOrder: string[]
): Record<string, FleetingNote[]> {
	const orderedGroups: Record<string, FleetingNote[]> = {};

	for (const groupName of groupOrder) {
		if (notes[groupName]) {
			orderedGroups[groupName] = notes[groupName];
		}
	}

	const remainingGroups: string[] = Object.keys(notes)
		.filter((groupName) => !groupOrder.includes(groupName))
		.sort();

	for (const groupName of remainingGroups) {
		if (!orderedGroups[groupName]) {
			orderedGroups[groupName] = notes[groupName];
		}
	}

	return orderedGroups;
}
