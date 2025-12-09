import type { Plugin } from "obsidian";
import type { DashboardConfig } from "../types/config";

export const DEFAULT_CONFIG: DashboardConfig = {
	fleetingNotes: {
		groupOrder: ["Inbox"],
		sortAlphabetically: true,
		expandedGroups: ["Inbox"],
	},
	projects: {
		sortBy: "name",
		expandedProjects: [],
	},
	general: {
		theme: "auto",
	},
};

/**
 * ConfigManager - Singleton for managing plugin configuration
 * Automatically persists to Obsidian plugin data
 */
export class ConfigManager {
	private plugin: Plugin;
	private config: DashboardConfig;
	private listeners: Set<(config: DashboardConfig) => void> = new Set();

	constructor(plugin: Plugin) {
		this.plugin = plugin;
		this.config = DEFAULT_CONFIG;
	}

	/**
	 * Notify all listeners
	 */
	private notifyListeners() {
		for (const listener of this.listeners) {
			listener(this.config);
		}
	}

	/**
	 * Reset to default config
	 */
	async reset() {
		this.config = DEFAULT_CONFIG;
		await this.save();
	}

	/**
	 * Load config from Obsidian plugin data
	 */
	async load() {
		try {
			const saved = await this.plugin.loadData();
			if (saved) {
				// Merge with defaults to ensure all keys exist
				this.config = {
					...DEFAULT_CONFIG,
					...saved,
					fleetingNotes: {
						...DEFAULT_CONFIG.fleetingNotes,
						...saved?.fleetingNotes,
					},
					projects: {
						...DEFAULT_CONFIG.projects,
						...saved?.projects,
					},
					general: {
						...DEFAULT_CONFIG.general,
						...saved?.general,
					},
				};
				console.log("[Config] Loaded configuration");
			}
		} catch (error) {
			console.error("[Config] Error loading config:", error);
			this.config = DEFAULT_CONFIG;
		}
	}

	/**
	 * Save config to Obsidian plugin data
	 */
	async save() {
		try {
			await this.plugin.saveData(this.config);
			console.log("[Config] Configuration saved");
			this.notifyListeners();
		} catch (error) {
			console.error("[Config] Error saving config:", error);
		}
	}

	/**
	 * Update entire config
	 */
	async setConfig(config: Partial<DashboardConfig>) {
		this.config = {
			...this.config,
			...config,
		};
		await this.save();
	}

	/**
	 * Update FleetingNotes config
	 */
	async setFleetingNotesConfig(
		config: Partial<DashboardConfig["fleetingNotes"]>
	) {
		this.config.fleetingNotes = {
			...this.config.fleetingNotes,
			...config,
		};
		await this.save();
	}

	/**
	 * Update Projects config
	 */
	async setProjectsConfig(config: Partial<DashboardConfig["projects"]>) {
		this.config.projects = {
			...this.config.projects,
			...config,
		};
		await this.save();
	}

	/**
	 * Set which FleetingNotes groups are expanded
	 */
	async setFleetingNotesExpandedGroups(groups: string[]) {
		await this.setFleetingNotesConfig({ expandedGroups: groups });
	}

	/**
	 * Toggle FleetingNotes group expanded state
	 */
	async toggleFleetingNotesGroupExpanded(groupName: string) {
		const current = this.config.fleetingNotes.expandedGroups;
		const updated = current.includes(groupName)
			? current.filter((g) => g !== groupName)
			: [...current, groupName];
		await this.setFleetingNotesExpandedGroups(updated);
	}

	/**
	 * Reorder FleetingNotes groups
	 * Call this from drag-n-drop in future
	 */
	async setFleetingNotesGroupOrder(order: string[]) {
		await this.setFleetingNotesConfig({ groupOrder: order });
	}

	/**
	 * Get current config
	 */
	getConfig(): DashboardConfig {
		return this.config;
	}

	/**
	 * Subscribe to config changes
	 */
	subscribe(callback: (config: DashboardConfig) => void): () => void {
		this.listeners.add(callback);
		return () => this.listeners.delete(callback);
	}
}

/**
 * Global singleton instance
 */
let instance: ConfigManager | null = null;

/**
 * Create and initialize singleton (call once in main.ts)
 */
export function createConfigManager(plugin: Plugin): ConfigManager {
	if (!instance) {
		instance = new ConfigManager(plugin);
	}
	return instance;
}

/**
 * Get existing manager instance
 */
export function getConfigManager(): ConfigManager {
	if (!instance) {
		throw new Error(
			"ConfigManager not initialized. Call createConfigManager first."
		);
	}
	return instance;
}
