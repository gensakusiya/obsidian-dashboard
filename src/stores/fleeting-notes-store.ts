import { writable, derived } from "svelte/store";
import type { FleetingNote } from "../types/fleeting-note";
import { getFleetingNotesManager } from "../fleeting-notes/manager";
import { getConfigManager } from "../config/manager";
import { applySortingToNotes } from "../fleeting-notes/helper";
import { selectedDate } from "./store";
import { isSameDate } from "../utils/date";

export interface FleetingNotesStore {
	notes: Record<string, FleetingNote[]>;
	isLoading: boolean;
	error: string | null;
}

/**
 * FleetingNotes store with grouped and sorted data (Singleton)
 * Initialize once in main.ts, then use in any component
 *
 * Usage:
 *   In main.ts:
 *     initFleetingNotesStore();
 *
 *   In any component:
 *     import { fleetingNotesStore } from '../../stores/fleeting-notes-store';
 *     let notes = $fleetingNotesStore;
 */
export const fleetingNotesStore = writable<FleetingNotesStore>({
	notes: {},
	isLoading: true,
	error: null,
});

// Reactive version (for use in Svelte components with $)
export const inboxNotes = derived(fleetingNotesStore, ($store) => {
	const configManager = getConfigManager();
	const mainFile = configManager.getConfig().fleetingNotes.mainFile;
	return $store.notes[mainFile] || [];
});

// Reactive derived store combining fleetingNotesStore and selectedDate
export const inboxNotesOnDate = derived(
	[fleetingNotesStore, selectedDate],
	([$store, $date]) => {
		const configManager = getConfigManager();
		const mainFile = configManager.getConfig().fleetingNotes.mainFile;
		const allInboxNotes = $store.notes[mainFile] || [];

		// Filter notes by selected date
		return allInboxNotes.filter((note) => {
			if (!note.date) return false;
			return isSameDate(note.date, $date);
		});
	}
);

let isInitialized = false;
let unsubscribeFns: Array<() => void> = [];

export function initFleetingNotesStore() {
	if (isInitialized) {
		console.log("[FleetingNotesStore] Already initialized");
		return;
	}

	isInitialized = true;
	const notesManager = getFleetingNotesManager();
	const configManager = getConfigManager();

	// Apply grouping and sorting
	function updateStore() {
		const notes = notesManager.notes;
		const config = configManager.getConfig();

		const ordered: Record<string, FleetingNote[]> = applySortingToNotes(
			notes,
			config.fleetingNotes.groupOrder || {}
		);

		fleetingNotesStore.set({
			notes: ordered,
			isLoading: notesManager.isLoading,
			error: notesManager.error,
		});
	}

	// Subscribe to manager changes
	unsubscribeFns.push(
		notesManager.subscribe(() => {
			updateStore();
		})
	);

	// Subscribe to config changes
	unsubscribeFns.push(
		configManager.subscribe(() => {
			updateStore();
		})
	);

	// Initial load
	updateStore();

	console.log("[FleetingNotesStore] Initialized");
}

export function destroyFleetingNotesStore() {
	for (const unsubscribe of unsubscribeFns) {
		unsubscribe();
	}
	unsubscribeFns = [];
	isInitialized = false;
	console.log("[FleetingNotesStore] Destroyed");
}
