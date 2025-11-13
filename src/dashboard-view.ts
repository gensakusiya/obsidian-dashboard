import { ItemView, WorkspaceLeaf } from "obsidian";
import { mount, unmount } from "svelte";
import MainComponent from "./components/Main.svelte";

export const VIEW_TYPE_DASHBOARD = "dashboard-view";

export class DashboardView extends ItemView {
	component: ReturnType<typeof MainComponent> | unknown;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_DASHBOARD;
	}

	getDisplayText() {
		return "Dashboard";
	}

	getIcon() {
		return "dice";
	}

	async onOpen() {
		this.component = mount(MainComponent, {
			target: this.contentEl,
			props: { message: "Dashboard Plugin Ready Again!" },
		});
	}

	async onClose() {
		if (this.component) {
			unmount(this.component);
		}
	}
}
