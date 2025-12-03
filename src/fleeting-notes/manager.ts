import { type App, TAbstractFile } from "obsidian";
import type { FleetingNote } from "../types/fleeting-note";
import { getAllFleetingNotes } from "./index";
import { FLEETING_NOTES_FOLDER } from "./consts";

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
export class FleetingNotesManager {
	private app: App;
	private unsubscribers: Array<() => void> = [];
	private listeners: Set<() => void> = new Set();

	notes: FleetingNote[] = [];
	isLoading = true; // Start with loading state until initialize() is called
	error: string | null = null;

	constructor(app: App) {
		this.app = app;
	}

	private isFleetingNotesFile(file: TAbstractFile): boolean {
		return file.path.startsWith(`${FLEETING_NOTES_FOLDER}/`);
	}

	private notifyListeners() {
		for (const listener of this.listeners) {
			listener();
		}
	}

	private setupFileWatchers() {
		const onModify = (file: TAbstractFile) => {
			if (this.isFleetingNotesFile(file)) {
				this.refresh();
			}
		};

		const onCreate = (file: TAbstractFile) => {
			if (this.isFleetingNotesFile(file)) {
				this.refresh();
			}
		};

		const onDelete = (file: TAbstractFile) => {
			if (this.isFleetingNotesFile(file)) {
				this.refresh();
			}
		};

		const onRename = (file: TAbstractFile) => {
			if (this.isFleetingNotesFile(file)) {
				this.refresh();
			}
		};

		this.app.vault.on("modify", onModify);
		this.app.vault.on("create", onCreate);
		this.app.vault.on("delete", onDelete);
		this.app.vault.on("rename", onRename);

		// Store unsubscribers
		this.unsubscribers.push(
			() => this.app.vault.off("modify", onModify),
			() => this.app.vault.off("create", onCreate),
			() => this.app.vault.off("delete", onDelete),
			() => this.app.vault.off("rename", onRename)
		);
	}

	async initialize() {
		await this.refresh();
		this.setupFileWatchers();
	}

	async refresh() {
		this.isLoading = true;
		this.error = null;

		try {
			const data = await getAllFleetingNotes(this.app);
			this.notes = data;
		} catch (err) {
			console.error("[FleetingNotes] Error refreshing notes:", err);
			this.error = err instanceof Error ? err.message : "Unknown error";
		} finally {
			this.isLoading = false;
			this.notifyListeners();
		}
	}

	subscribe(callback: () => void): () => void {
		this.listeners.add(callback);
		return () => this.listeners.delete(callback);
	}

	getFilteredNotes(options?: {
		source?: string;
		searchText?: string;
	}): FleetingNote[] {
		let filtered = this.notes;

		if (options?.source) {
			filtered = filtered.filter((n) => n.source === options.source);
		}

		if (options?.searchText) {
			const search = options.searchText.toLowerCase();
			filtered = filtered.filter((n) =>
				n.title.toLowerCase().includes(search)
			);
		}

		return filtered;
	}

	/**
	 * Get notes grouped by source file
	 */
	getGroupedBySource(): Record<string, FleetingNote[]> {
		const grouped: Record<string, FleetingNote[]> = {};

		for (const note of this.notes) {
			if (!grouped[note.source]) {
				grouped[note.source] = [];
			}
			grouped[note.source].push(note);
		}

		return grouped;
	}

	/**
	 * Cleanup and unsubscribe from all watchers
	 */
	destroy() {
		for (const unsubscribe of this.unsubscribers) {
			unsubscribe();
		}
		this.unsubscribers = [];
		this.listeners.clear();
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
