import { ItemView, WorkspaceLeaf } from "obsidian";
import { mount, unmount } from "svelte";
import ProjectsPageComponent from "../components/Projects/ProjectsPage.svelte";

export const VIEW_TYPE_PROJECTS = "projects-view";

export class ProjectsView extends ItemView {
	component: ReturnType<typeof ProjectsPageComponent> | unknown;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_PROJECTS;
	}

	getDisplayText() {
		return "Projects";
	}

	getIcon() {
		return "list-checks";
	}

	async onOpen() {
		this.component = mount(ProjectsPageComponent, {
			target: this.contentEl,
			props: {
				app: this.app,
			},
		});
	}

	async onClose() {
		if (this.component) {
			unmount(this.component);
		}
	}
}
