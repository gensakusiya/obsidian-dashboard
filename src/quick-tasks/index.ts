import { App, TFile } from "obsidian";
import { parse, isEqual } from "date-fns";
import type { QuickTask } from "../types/quick-task";
import { simpleHash } from "../utils/hash";
import {
	QUICK_TASKS_DATE_FORMAT,
	QUICK_TASKS_FOLDER,
	QUICK_TASKS_INBOX_FILE,
} from "./consts";

/**
 * Parse a markdown file and extract uncompleted tasks only
 */
function parseTasksFromContent(
	content: string,
	sourceFile: string
): QuickTask[] {
	const tasks: QuickTask[] = [];
	const lines = content.split("\n");

	for (const line of lines) {
		// Match only uncompleted tasks: - [ ]
		const taskMatch = line.match(/^[\s]*-\s*\[\s\]\s+(.+)$/);
		if (!taskMatch) continue;

		const taskText = taskMatch[1].trim();
		const date = extractDate(taskText);

		tasks.push({
			id: generateTaskId(sourceFile, taskText),
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
function generateTaskId(source: string, text: string): string {
	const hash = simpleHash(source + text);
	return `task-${hash}`;
}

/**
 * Get all tasks from QuickTasks folder
 */
export async function getAllQuickTasks(app: App): Promise<QuickTask[]> {
	const quickTasksFolder =
		app.vault.getAbstractFileByPath(QUICK_TASKS_FOLDER);

	if (!quickTasksFolder) {
		console.warn("[QuickTasks] QuickTasks folder not found");
		return [];
	}

	const allTasks: QuickTask[] = [];

	// Get all markdown files in QuickTasks folder
	const files = app.vault
		.getMarkdownFiles()
		.filter((file) => file.path.startsWith(`${QUICK_TASKS_FOLDER}/`));

	for (const file of files) {
		try {
			const content = await app.vault.read(file);
			const tasks = parseTasksFromContent(content, file.name);
			allTasks.push(...tasks);
		} catch (error) {
			console.error(
				`[QuickTasks] Error reading file ${file.path}:`,
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
export async function getTasksForDate(
	app: App,
	date: Date
): Promise<QuickTask[]> {
	const allTasks = await getAllQuickTasks(app);

	// Filter tasks that have the specified date
	const tasksForDate = allTasks.filter((task) => {
		if (!task.date) return false;

		return isEqual(
			parse(task.date, QUICK_TASKS_DATE_FORMAT, new Date()),
			date
		);
	});

	// If there are tasks for this date, return them
	if (tasksForDate.length > 0) {
		return tasksForDate;
	}

	// Otherwise, return tasks from Inbox.md
	return getTasksFromInbox(app);
}

/**
 * Get tasks from Inbox.md
 */
export async function getTasksFromInbox(app: App): Promise<QuickTask[]> {
	return getTasksFromFile(app, QUICK_TASKS_INBOX_FILE);
}

/**
 * Get tasks from a specific file
 */
export async function getTasksFromFile(
	app: App,
	fileName: string
): Promise<QuickTask[]> {
	const filePath = fileName.endsWith(".md")
		? `${QUICK_TASKS_FOLDER}/${fileName}`
		: `${QUICK_TASKS_FOLDER}/${fileName}.md`;

	const file = app.vault.getAbstractFileByPath(filePath);

	if (!file || !(file instanceof TFile)) {
		console.warn(`[QuickTasks] File not found: ${filePath}`);
		return [];
	}

	try {
		const content = await app.vault.read(file);
		return parseTasksFromContent(content, file.name);
	} catch (error) {
		console.error(`[QuickTasks] Error reading file ${filePath}:`, error);
		return [];
	}
}
