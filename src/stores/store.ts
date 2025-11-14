import { writable } from "svelte/store";

// Store for selected date in dashboard
export const selectedDate = writable<Date>(new Date());

// Store for tasks data (optional, for future)
export const tasksData = writable<Map<string, unknown>>(new Map());

// Store for projects data (optional, for future)
export const projectsData = writable<unknown[]>([]);
