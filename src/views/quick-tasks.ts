import { ItemView, WorkspaceLeaf } from "obsidian";
import QuickTasksPageComponent from "../components/QuickTasks/QuickTasksPage.svelte";

export const VIEW_TYPE_QUICK_TASKS = "quick-tasks-view";

export class QuickTasksView extends ItemView {
	component: QuickTasksPageComponent;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_QUICK_TASKS;
	}

	getDisplayText() {
		return "Quick Tasks";
	}

	getIcon() {
		return "list-checks";
	}

	async onOpen() {
		const container = this.contentEl;
		container.empty();

		this.component = new QuickTasksPageComponent({
			target: container,
			props: {
				app: this.app,
			},
		});
	}

	async onClose() {
		if (this.component) {
			this.component.$destroy();
		}
	}
}
