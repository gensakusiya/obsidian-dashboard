export interface DashboardConfig {
	// FleetingNotes page settings
	fleetingNotes: {
		/** Order of groups (Inbox first, then alphabetically) */
		groupOrder: string[];
		/** Auto-sort other groups alphabetically */
		sortAlphabetically: boolean;
		/** Which groups are currently expanded */
		expandedGroups: string[];
	};

	// Projects page settings
	projects: {
		/** Sort by: name, priority, activity */
		sortBy: "name" | "priority" | "activity";
		/** Which projects are currently expanded */
		expandedProjects: string[];
	};

	// General settings
	general: {
		/** Theme preference */
		theme: "auto" | "light" | "dark";
	};
}
