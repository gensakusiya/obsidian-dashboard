export interface FleetingNote {
	id: string;
	title: string;
	completed: boolean;
	source: string; // filename without .md
	date?: string; // Date in YYYY-MM-DD format if specified
}
