import { App, TFile } from "obsidian";
import {
	KANBAN_COLUMNS,
	PRIORITIES,
	type KanbanStatus,
	type KanbanTask,
	type Priority,
	type Project,
} from "../types/project";
import { KANBAN_FILE_NAME, PROJECTS_FOLDER } from "./consts";
import { DashboardManager } from "../core/manager";
import { getAllProjects } from "./parser";

export class ProjectsManager extends DashboardManager<Project[]> {
	FILE_FOLDER: string = PROJECTS_FOLDER;

	getData(app: App): Promise<Project[]> {
		return getAllProjects(app);
	}
}

let instance: ProjectsManager | null = null;

export function createProjectsManager(app: App): ProjectsManager {
	if (!instance) {
		instance = new ProjectsManager(app);
	}
	return instance;
}

export function getProjectsManager(): ProjectsManager {
	if (!instance) {
		throw new Error(
			"ProjectsManager not initialized. Call createProjectsManager first."
		);
	}
	return instance;
}
