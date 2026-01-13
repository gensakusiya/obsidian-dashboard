import { writable } from "svelte/store";
import type { Project } from "../types/project";
import { getProjectsManager } from "../projects/manager";

export interface ProjectsStore {
	projects: Project[];
	isLoading: boolean;
	error: string | null;
}

/**
 * Projects store with grouped and sorted data (Singleton)
 * Initialize once in main.ts, then use in any component
 *
 * Usage:
 *   In main.ts:
 *     initProjectsStore();
 *
 *   In any component:
 *     import { projectsStore } from '../../stores/projects-store';
 *     let projects = $projectsStore;
 */
export const projectsStore = writable<ProjectsStore>({
	projects: [],
	isLoading: true,
	error: null,
});

let isInitialized = false;
let unsubscribeFns: Array<() => void> = [];

export function initProjectsStore() {
	if (isInitialized) {
		return;
	}

	isInitialized = true;
	const projectManager = getProjectsManager();

	// Apply grouping and sorting
	function updateStore() {
		projectsStore.set({
			projects: projectManager.data,
			isLoading: projectManager.isLoading,
			error: projectManager.error,
		});
	}

	// Subscribe to manager changes
	unsubscribeFns.push(
		projectManager.subscribe(() => {
			updateStore();
		})
	);

	// Initial load
	updateStore();
}

export function destroyProjectsStore() {
	for (const unsubscribe of unsubscribeFns) {
		unsubscribe();
	}

	unsubscribeFns = [];
	isInitialized = false;
}
