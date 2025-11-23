import { App, TFile } from "obsidian";
import {
	KANBAN_COLUMNS,
	PRIORITIES,
	type KanbanStatus,
	type KanbanTask,
	type Priority,
} from "../types/projects";
import { KANBAN_FILE_NAME, PROJECTS_FOLDER } from "./consts";

/**
 * Parse Kanban markdown format
 * Supports:
 * - [High/Medium/Low] prefix for priority
 * - @{YYYY-MM-DD} for due dates
 *
 * Example:
 * ## Backlog
 * - [ ] [High] Task name
 *     @{2025-12-31}
 */
export function parseKanban(
	content: string,
	projectName: string
): KanbanTask[] {
	const tasks: KanbanTask[] = [];

	// Create a map for faster column lookup
	const columnMap = new Map<string, KanbanStatus>(
		Object.values(KANBAN_COLUMNS).map((col) => [col, col as KanbanStatus])
	);

	// Create priority map for case-insensitive matching
	const priorityMap = new Map<string, Priority>(
		Object.values(PRIORITIES).map((p) => [p.toLowerCase(), p])
	);

	// Build regex patterns from PRIORITIES constant
	const priorityValues = Object.values(PRIORITIES).join("|");
	const priorityPrefixPattern = new RegExp(
		`^\\[(${priorityValues})\\]\\s+(.+)$`,
		"i"
	);
	const priorityTagPattern = new RegExp(`#(${priorityValues})`, "i");

	// Split content into sections by headers (##)
	const sections = content.split(/^##\s+/m).slice(1); // Skip first empty element

	let taskIndex = 0;

	for (const section of sections) {
		const lines = section.split("\n");
		const headerName = lines[0].trim();
		const currentStatus = columnMap.get(headerName);

		if (!currentStatus) continue;

		// Process all tasks in this section at once using regex
		const sectionText = lines.slice(1).join("\n");

		// Match task blocks: task line followed by optional metadata lines
		const taskPattern = /^[\s]*-\s+\[\s*\]\s+(.+?)(?=\n[\s]*-\s+\[|$)/gm;
		const taskMatches = Array.from(sectionText.matchAll(taskPattern));

		for (const match of taskMatches) {
			const taskBlock = match[1];
			const firstLineEnd = taskBlock.indexOf("\n");
			const taskLine =
				firstLineEnd === -1
					? taskBlock
					: taskBlock.slice(0, firstLineEnd);
			const metadata =
				firstLineEnd === -1 ? "" : taskBlock.slice(firstLineEnd + 1);

			let taskText = taskLine.trim();
			let priority: Priority | undefined;
			let dueDate: Date | undefined;

			// Extract priority from [High/Medium/Low] prefix
			const priorityMatch = taskText.match(priorityPrefixPattern);
			if (priorityMatch) {
				priority = priorityMap.get(priorityMatch[1].toLowerCase());
				taskText = priorityMatch[2];
			}

			// Extract metadata from the entire block at once
			const dateMatch = metadata.match(/@\{(\d{4}-\d{2}-\d{2})\}/);
			if (dateMatch) {
				dueDate = new Date(dateMatch[1]);
			}

			// Check for priority tag: #high #medium #low (only if no prefix priority)
			if (!priority) {
				const tagMatch = metadata.match(priorityTagPattern);
				if (tagMatch) {
					priority = priorityMap.get(tagMatch[1].toLowerCase());
				}
			}

			tasks.push({
				id: `${projectName}-${currentStatus}-${taskIndex}`,
				title: taskText,
				status: currentStatus,
				priority: priority || PRIORITIES.MEDIUM,
				dueDate,
				projectName,
			});

			taskIndex++;
		}
	}

	return tasks;
}

/**
 * Get all tasks from a project's Kanban board
 */
export async function getProjectKanbanTasks(
	app: App,
	projectName: string
): Promise<KanbanTask[]> {
	try {
		const kanbanPath = `Projects/${projectName}/Kanban.md`;
		const file = app.vault.getAbstractFileByPath(kanbanPath);

		if (!file || !(file instanceof TFile)) {
			console.warn(`[Kanban] File not found: ${kanbanPath}`);
			return [];
		}

		const content = await app.vault.read(file);
		return parseKanban(content, projectName);
	} catch (error) {
		console.error(`[Kanban] Error reading project ${projectName}:`, error);
		return [];
	}
}

/**
 * Get only active tasks (Backlog + In Progress, optionally filtered by priority)
 */
export async function getProjectActiveTasks(
	app: App,
	projectName: string,
	priority?: Priority
): Promise<KanbanTask[]> {
	const allTasks = await getProjectKanbanTasks(app, projectName);

	return allTasks.filter((task) => {
		// Only include Backlog and In Progress
		if (
			// task.status !== KANBAN_COLUMNS.BACKLOG &&
			task.status !== KANBAN_COLUMNS.IN_PROGRESS
		) {
			return false;
		}

		// Filter by priority if specified
		if (priority && task.priority !== priority) {
			return false;
		}

		return true;
	});
}

export interface Project {
	name: string;
	taskCount: number;
	inProgressCount: number;
}

/**
 * Get all projects from the Projects folder
 * Shows all folders in Projects/, but only loads tasks from those with Kanban.md
 */
export async function getAllProjects(app: App): Promise<Project[]> {
	try {
		const projectsFolder = app.vault.getAbstractFileByPath(PROJECTS_FOLDER);
		if (!projectsFolder) {
			console.warn("[Projects] Projects folder not found");
			return [];
		}

		const projects: Project[] = [];
		const folders = app.vault
			.getAllLoadedFiles()
			.filter(
				(file) =>
					file.parent?.path === PROJECTS_FOLDER && "children" in file
			);

		for (const folder of folders) {
			const projectName = folder.name;

			// Check if Kanban.md exists for this project
			const kanbanPath = `${PROJECTS_FOLDER}/${projectName}/${KANBAN_FILE_NAME}`;
			const kanbanFile = app.vault.getAbstractFileByPath(kanbanPath);
			const hasKanban = kanbanFile && kanbanFile instanceof TFile;

			let tasks: KanbanTask[] = [];
			let inProgressCount = 0;

			// Only load tasks if Kanban.md exists
			if (hasKanban) {
				tasks = await getProjectKanbanTasks(app, projectName);
				inProgressCount = tasks.filter(
					(task) => task.status === KANBAN_COLUMNS.IN_PROGRESS
				).length;
			}

			projects.push({
				name: projectName,
				taskCount: tasks.length,
				inProgressCount,
			});
		}

		return projects.sort((a, b) => a.name.localeCompare(b.name));
	} catch (error) {
		console.error("[Projects] Error loading projects:", error);
		return [];
	}
}
