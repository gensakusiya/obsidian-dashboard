import {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	WorkspaceLeaf,
} from "obsidian";
import { DashboardView } from "./views/dashboard";
import {
	FleetingNotesView,
	VIEW_TYPE_FLEETING_NOTES,
} from "./views/fleeting-notes";
import { ProjectsView, VIEW_TYPE_PROJECTS } from "./views/project";
import { initializeVaultStructure } from "./utils/initialization";
import {
	initFleetingNotesStore,
	destroyFleetingNotesStore,
} from "./stores/fleeting-notes-store";
import {
	destroyProjectsStore,
	initProjectsStore,
} from "./stores/projects-store";
import type { DashboardManager } from "./core/manager";
import { ConfigManager, createConfigManager } from "./config";
import { createFleetingNotesManager } from "./fleeting-notes";
import { createProjectsManager } from "./projects";

interface DashboardPluginSettings {
	mode: string;
}

const DEFAULT_SETTINGS: DashboardPluginSettings = {
	mode: "default",
};

const VIEW_TYPE_DASHBOARD = "dashboard-view";

export default class DashboardPlugin extends Plugin {
	configManager: ConfigManager;

	managers: DashboardManager[] = [];

	async onload() {
		this.configManager = createConfigManager(this);

		this.managers.push(createFleetingNotesManager(this.app));
		this.managers.push(createProjectsManager(this.app));

		if (!this.app.workspace.layoutReady) {
			this.app.workspace.onLayoutReady(async () => {
				initializeVaultStructure(this.app);

				for (const manager of this.managers) {
					await manager.initialize();
				}

				initFleetingNotesStore();
				initProjectsStore();
			});
		}

		await this.loadSettings();

		// Register the custom views
		this.registerView(
			VIEW_TYPE_DASHBOARD,
			(leaf) => new DashboardView(leaf)
		);
		this.registerView(
			VIEW_TYPE_FLEETING_NOTES,
			(leaf) => new FleetingNotesView(leaf)
		);
		this.registerView(VIEW_TYPE_PROJECTS, (leaf) => new ProjectsView(leaf));

		// Create ribbon icon for Dashboard
		this.addRibbonIcon("dice", "Open Dashboard", async () => {
			const workspace = this.app.workspace;
			let leaf: WorkspaceLeaf | null = null;
			const leaves = workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD);

			if (leaves.length > 0) {
				leaf = leaves[0];
			} else {
				leaf = workspace.getLeaf("tab");
			}

			if (leaf !== null) {
				await leaf.setViewState({
					type: VIEW_TYPE_DASHBOARD,
					active: true,
				});
				workspace.revealLeaf(leaf);
			}
		});

		// Add command for Fleeting Notes
		this.addCommand({
			id: "open-fleeting-notes",
			name: "Open Fleeting Notes",
			callback: async () => {
				const workspace = this.app.workspace;
				let leaf: WorkspaceLeaf | null = null;
				const leaves = workspace.getLeavesOfType(
					VIEW_TYPE_FLEETING_NOTES
				);

				if (leaves.length > 0) {
					leaf = leaves[0];
				} else {
					leaf = workspace.getLeaf("tab");
				}

				if (leaf !== null) {
					await leaf.setViewState({
						type: VIEW_TYPE_FLEETING_NOTES,
						active: true,
					});
					workspace.revealLeaf(leaf);
				}
			},
		});

		// Add settings tab
		this.addSettingTab(new DashboardSettingTab(this.app, this));
	}

	onunload() {
		this.managers.forEach((manager) => manager.destroy());

		destroyFleetingNotesStore();
		destroyProjectsStore();
	}

	async loadSettings() {
		await this.configManager.load();
	}

	async saveSettings() {
		await this.configManager.save();
	}
}

class DashboardSettingTab extends PluginSettingTab {
	plugin: DashboardPlugin;

	constructor(app: App, plugin: DashboardPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const settings = this.plugin.configManager.getConfig();

		new Setting(containerEl)
			.setName("FleetingNotes order")
			.setDesc("Customize the order of FleetingNotes groups.")
			.addText((text) =>
				text
					.setPlaceholder("e.g. Inbox, Ideas, Tasks")
					.setValue(settings.fleetingNotes.groupOrder.join(", "))
					.onChange(async (value) => {
						const groups = value.split(",").map((s) => s.trim());
						await this.plugin.configManager.setFleetingNotesGroupOrder(
							groups
						);

						await this.plugin.saveSettings();
					})
			);
	}
}
