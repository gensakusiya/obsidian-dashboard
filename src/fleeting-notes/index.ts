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

		tasks.push({
			id: generateNoteId(sourceFile, taskText),
			title: taskText,
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
 * If no tasks for the date, returns tasks from Inbox.md
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
 * Add a new fleeting note to Inbox.md
 * Format: - [ ] {title}
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
				`# Inbox\n\n- [ ] ${title}${dateTag}\n `
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
		return true;
	} catch (error) {
		console.error("[FleetingNotes] Error adding note:", error);
		return false;
	}
}
