import { App, TFile } from "obsidian";
import { parse, isEqual } from "date-fns";
import type { FleetingNote } from "../types/fleeting-note";
import { simpleHash } from "../utils/hash";
import {
	FLEETING_NOTES_DATE_FORMAT,
	FLEETING_NOTES_FOLDER,
	FLEETING_NOTES_INBOX_FILE,
} from "./consts";

/**
 * Parse a markdown file and extract uncompleted tasks only
 */
function parseNotesFromContent(
	content: string,
	sourceFile: string
): FleetingNote[] {
	const tasks: FleetingNote[] = [];
	const lines = content.split("\n");

	for (const line of lines) {
		// Match only uncompleted tasks: - [ ]
		const taskMatch = line.match(/^[\s]*-\s*\[\s\]\s+(.+)$/);
		if (!taskMatch) continue;

		const taskText = taskMatch[1].trim();
		const date = extractDate(taskText);

		const taskTextWithoutDate = taskText
			.replace(/@?(\d{4}-\d{2}-\d{2})/, "")
			.trim();

		tasks.push({
			id: generateNoteId(sourceFile, taskText),
			title: taskTextWithoutDate,
			completed: false,
			date,
			source: sourceFile.replace(".md", ""),
		});
	}

	return tasks;
}

/**
 * Extract date from task text in format YYYY-MM-DD or @YYYY-MM-DD
 */
function extractDate(text: string): string | undefined {
	const dateMatch = text.match(/@?(\d{4}-\d{2}-\d{2})/);
	return dateMatch ? dateMatch[1] : undefined;
}

/**
 * Generate a unique ID for a task
 */
function generateNoteId(source: string, text: string): string {
	const hash = simpleHash(source + text);
	return `task-${hash}`;
}

/**
 * Get all tasks from FleetingNotes folder
 */
export async function getAllFleetingNotes(app: App): Promise<FleetingNote[]> {
	const fleetingNotesFolder = app.vault.getAbstractFileByPath(
		FLEETING_NOTES_FOLDER
	);

	if (!fleetingNotesFolder) {
		console.warn("[FleetingNotes] FleetingNotes folder not found");
		return [];
	}

	const allTasks: FleetingNote[] = [];

	// Get all markdown files in FleetingNotes folder
	const files = app.vault
		.getMarkdownFiles()
		.filter((file) => file.path.startsWith(`${FLEETING_NOTES_FOLDER}/`));

	for (const file of files) {
		try {
			const content = await app.vault.read(file);
			const tasks = parseNotesFromContent(content, file.name);
			allTasks.push(...tasks);
		} catch (error) {
			console.error(
				`[FleetingNotes] Error reading file ${file.path}:`,
				error
			);
		}
	}

	return allTasks;
}

/**
 * Get tasks for a specific date (YYYY-MM-DD format)
 */
export async function getNotesForDate(
	app: App,
	date: Date
): Promise<FleetingNote[]> {
	const allTasks = await getAllFleetingNotes(app);

	// Filter tasks that have the specified date
	const tasksForDate = allTasks.filter((task) => {
		if (!task.date) return false;

		return isEqual(
			parse(task.date, FLEETING_NOTES_DATE_FORMAT, new Date()),
			date
		);
	});

	// If there are tasks for this date, return them
	if (tasksForDate.length > 0) {
		return tasksForDate;
	}

	return [];
}

/**
 * Get tasks from Inbox.md
 */
export async function getNotesFromInbox(app: App): Promise<FleetingNote[]> {
	return getNotesFromFile(app, FLEETING_NOTES_INBOX_FILE);
}

/**
 * Get tasks from a specific file
 */
export async function getNotesFromFile(
	app: App,
	fileName: string
): Promise<FleetingNote[]> {
	const filePath = fileName.endsWith(".md")
		? `${FLEETING_NOTES_FOLDER}/${fileName}`
		: `${FLEETING_NOTES_FOLDER}/${fileName}.md`;

	const file = app.vault.getAbstractFileByPath(filePath);

	if (!file || !(file instanceof TFile)) {
		console.warn(`[FleetingNotes] File not found: ${filePath}`);
		return [];
	}

	try {
		const content = await app.vault.read(file);
		return parseNotesFromContent(content, file.name);
	} catch (error) {
		console.error(`[FleetingNotes] Error reading file ${filePath}:`, error);
		return [];
	}
}

/**
 * Add a new fleeting note
 * Format: - [ ] {title} [@date]
 */
export async function addFleetingNote(
	app: App,
	note: Partial<FleetingNote>
): Promise<boolean> {
	if (!note.title?.trim()) {
		console.warn("[FleetingNotes] Cannot add empty note");
		return false;
	}

	try {
		const filePath = `${FLEETING_NOTES_FOLDER}/${FLEETING_NOTES_INBOX_FILE}`;
		let file = app.vault.getAbstractFileByPath(filePath);

		const title = note.title.trim();
		const dateTag = note.date ? ` @${note.date}` : "";

		// Create Inbox.md if it doesn't exist
		if (!file) {
			file = await app.vault.create(
				filePath,
				`# Inbox\n\n- [ ] ${title}${dateTag}\n`
			);
			console.log("[FleetingNotes] Created new note in Inbox");
			return true;
		}

		// Append to existing file
		const content = await app.vault.read(file as TFile);
		const newContent = content.endsWith("\n")
			? content + `- [ ] ${title}${dateTag}\n`
			: content + `\n- [ ] ${title}${dateTag}\n`;

		await app.vault.modify(file as TFile, newContent);
		console.log("[FleetingNotes] Note added to Inbox");
		return true;
	} catch (error) {
		console.error("[FleetingNotes] Error adding note:", error);
		return false;
	}
}

/**
 * Delete a fleeting note from a file
 * @param app - Obsidian App
 * @param source - Source file name (e.g. "Inbox", without .md)
 * @param noteTitle - Exact title of the note to delete
 */
export async function deleteFleetingNote(
	app: App,
	source: string,
	noteTitle: string
): Promise<boolean> {
	try {
		const fileName = source.endsWith(".md") ? source : `${source}.md`;
		const filePath = `${FLEETING_NOTES_FOLDER}/${fileName}`;
		const file = app.vault.getAbstractFileByPath(filePath);

		if (!file || !(file instanceof TFile)) {
			console.warn(`[FleetingNotes] File not found: ${filePath}`);
			return false;
		}

		let content = await app.vault.read(file);
		const lines = content.split("\n");

		// Find and remove the line matching the note
		const newLines = lines.filter((line) => {
			// Match checkbox lines - [ ]
			const checkboxMatch = line.match(/^[\s]*-\s*\[\s*\]\s+(.+)$/);
			if (!checkboxMatch) return true; // Keep non-checkbox lines

			const lineTitle = checkboxMatch[1].trim();
			// Remove date tags for comparison
			const cleanTitle = lineTitle
				.replace(/@\{\d{4}-\d{2}-\d{2}\}/, "")
				.trim();
			const cleanNoteTitle = noteTitle
				.replace(/@\{\d{4}-\d{2}-\d{2}\}/, "")
				.trim();

			// Return false to remove this line
			return cleanTitle !== cleanNoteTitle;
		});

		const newContent = newLines.join("\n").trim();
		await app.vault.modify(file, newContent);
		console.log(`[FleetingNotes] Deleted note: ${noteTitle}`);
		return true;
	} catch (error) {
		console.error("[FleetingNotes] Error deleting note:", error);
		return false;
	}
}

/**
 * Update a fleeting note
 * @param app - Obsidian App
 * @param source - Source file name (e.g. "Inbox", without .md)
 * @param oldTitle - Current title of the note
 * @param newTitle - New title
 * @param newDate - New date (or undefined to remove date)
 */
export async function updateFleetingNote(
	app: App,
	source: string,
	oldTitle: string,
	newTitle: string,
	newDate?: string
): Promise<boolean> {
	try {
		const fileName = source.endsWith(".md") ? source : `${source}.md`;
		const filePath = `${FLEETING_NOTES_FOLDER}/${fileName}`;
		const file = app.vault.getAbstractFileByPath(filePath);

		if (!file || !(file instanceof TFile)) {
			console.warn(`[FleetingNotes] File not found: ${filePath}`);
			return false;
		}

		let content = await app.vault.read(file);
		const lines = content.split("\n");

		// Find and update the line matching the note
		const newLines = lines.map((line) => {
			// Match checkbox lines - [ ]
			const checkboxMatch = line.match(/^[\s]*-\s*\[\s*\]\s+(.+)$/);
			if (!checkboxMatch) return line; // Keep non-checkbox lines

			const lineTitle = checkboxMatch[1].trim();
			const cleanLineTitle = lineTitle
				.replace(/@\{\d{4}-\d{2}-\d{2}\}/, "")
				.trim();
			const cleanOldTitle = oldTitle
				.replace(/@\{\d{4}-\d{2}-\d{2}\}/, "")
				.trim();

			// Found the line to update
			if (cleanLineTitle === cleanOldTitle) {
				const dateTag = newDate ? ` @${newDate}` : "";
				return `- [ ] ${newTitle.trim()}${dateTag}`;
			}

			return line;
		});

		const newContent = newLines.join("\n");
		await app.vault.modify(file, newContent);
		console.log(`[FleetingNotes] Updated note: ${oldTitle} → ${newTitle}`);
		return true;
	} catch (error) {
		console.error("[FleetingNotes] Error updating note:", error);
		return false;
	}
}
