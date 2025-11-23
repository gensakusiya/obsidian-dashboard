export const KANBAN_COLUMNS = {
	BACKLOG: "Backlog",
	IN_PROGRESS: "In Progress",
	DONE: "Done",
} as const;

export type KanbanStatus = (typeof KANBAN_COLUMNS)[keyof typeof KANBAN_COLUMNS];

export const PRIORITIES = {
	HIGH: "high",
	MEDIUM: "medium",
	LOW: "low",
} as const;

export type Priority = (typeof PRIORITIES)[keyof typeof PRIORITIES];

export interface KanbanTask {
	id: string;
	title: string;
	projectName: string;
	status: KanbanStatus;
	priority?: Priority;
	dueDate?: Date;
}
