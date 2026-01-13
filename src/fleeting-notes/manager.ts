import { type App, TAbstractFile } from "obsidian";

import type { FleetingNote } from "../types/fleeting-note";
import { isSameDate, formatDateToDefault } from "../utils/date";
import {
	getAllFleetingNotes,
	addFleetingNote,
	updateFleetingNote,
} from "./parser";
import { FLEETING_NOTES_DEFAULT_FILE, FLEETING_NOTES_FOLDER } from "./consts";
import { DashboardManager } from "../core/manager";

/**
 * FleetingNotesManager - Singleton manager for fleeting notes
 * Plain TypeScript class - works everywhere
 *
 * Usage in main.ts:
 *   const manager = createFleetingNotesManager(app);
 *   await manager.initialize();
 *
 * Usage in components:
 *   const manager = getFleetingNotesManager();
 *   let { notes } = $derived.by(() => ({ notes: manager.notes }));
 */
export class FleetingNotesManager extends DashboardManager<
	Record<string, FleetingNote[]>
> {
	FILE_FOLDER = FLEETING_NOTES_FOLDER;
	inboxGroup = FLEETING_NOTES_DEFAULT_FILE;

	constructor(app: App) {
		super(app);
	}

	getData(app: App): Promise<Record<string, FleetingNote[]>> {
		return getAllFleetingNotes(app);
	}

	filterNotes(options?: {
		searchText?: string;
		date?: Date;
	}): Record<string, FleetingNote[]> {
		let filtered = this.data;

		const filterText = options?.searchText?.toLowerCase();
		const filterDate = options?.date;

		if (filterText || filterDate) {
			filtered = Object.fromEntries(
				Object.entries(filtered).map(([source, notes]) => [
					source,
					notes.filter((n) => {
						let result = true;

						if (filterText) {
							result = n.title.toLowerCase().includes(filterText);
						}
						if (filterDate) {
							result =
								result &&
								(n.date
									? isSameDate(n.date, filterDate)
									: false);
						}

						return result;
					}),
				])
			);
		}

		return filtered;
	}

	getNotesForDate(date: Date): Record<string, FleetingNote[]> {
		return this.filterNotes({ date });
	}

	addNote(note: Partial<FleetingNote>) {
		addFleetingNote(this.app, note);
	}

	updateFleetingNote(
		oldNote: FleetingNote,
		updatedFields: Partial<FleetingNote>
	) {
		const newNote: FleetingNote = { ...oldNote, ...updatedFields };
		updateFleetingNote(this.app, oldNote, newNote);
	}

	createNote(title: string, group: string, date?: Date) {
		const dateStr = date ? formatDateToDefault(date) : undefined;
		this.addNote({ title, date: dateStr, source: group });
	}
}

/**
 * Global singleton instance
 */
let instance: FleetingNotesManager | null = null;

/**
 * Create and initialize singleton (call once in main.ts)
 */
export function createFleetingNotesManager(app: App): FleetingNotesManager {
	if (!instance) {
		instance = new FleetingNotesManager(app);
	}
	return instance;
}

/**
 * Get existing manager instance (must be initialized first)
 */
export function getFleetingNotesManager(): FleetingNotesManager {
	if (!instance) {
		throw new Error(
			"FleetingNotesManager not initialized. Call createFleetingNotesManager first."
		);
	}
	return instance;
}
