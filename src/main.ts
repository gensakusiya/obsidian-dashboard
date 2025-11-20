import {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	WorkspaceLeaf,
} from "obsidian";
import { DashboardView } from "./views/dashboard";
import { QuickTasksView, VIEW_TYPE_QUICK_TASKS } from "./views/quick-tasks";
import { initializeVaultStructure } from "./utils/initialization";

interface DashboardPluginSettings {
	mode: string;
}

const DEFAULT_SETTINGS: DashboardPluginSettings = {
	mode: "default",
};

const VIEW_TYPE_DASHBOARD = "dashboard-view";

export default class DashboardPlugin extends Plugin {
	settings: DashboardPluginSettings;

	async onload() {
		// Wait for workspace to be fully loaded
		if (!this.app.workspace.layoutReady) {
			this.app.workspace.onLayoutReady(() => {
				initializeVaultStructure(this.app);
			});
		}

		await this.loadSettings();

		// Register the custom views
		this.registerView(
			VIEW_TYPE_DASHBOARD,
			(leaf) => new DashboardView(leaf)
		);
		this.registerView(
			VIEW_TYPE_QUICK_TASKS,
			(leaf) => new QuickTasksView(leaf)
		);

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

		// Add command for Quick Tasks
		this.addCommand({
			id: "open-quick-tasks",
			name: "Open Quick Tasks",
			callback: async () => {
				const workspace = this.app.workspace;
				let leaf: WorkspaceLeaf | null = null;
				const leaves = workspace.getLeavesOfType(VIEW_TYPE_QUICK_TASKS);

				if (leaves.length > 0) {
					leaf = leaves[0];
				} else {
					leaf = workspace.getLeaf("tab");
				}

				if (leaf !== null) {
					await leaf.setViewState({
						type: VIEW_TYPE_QUICK_TASKS,
						active: true,
					});
					workspace.revealLeaf(leaf);
				}
			},
		});

		// Add settings tab
		this.addSettingTab(new DashboardSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
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

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mode)
					.onChange(async (value) => {
						this.plugin.settings.mode = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
