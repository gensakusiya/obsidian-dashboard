import { ItemView, WorkspaceLeaf } from "obsidian";
import { mount, unmount } from "svelte";
import FleetingNotesPageComponent from "../components/FleetingNotes/FleetingNotesPage.svelte";

export const VIEW_TYPE_FLEETING_NOTES = "fleeting-notes-view";

export class FleetingNotesView extends ItemView {
	component: ReturnType<typeof FleetingNotesPageComponent> | unknown;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_FLEETING_NOTES;
	}

	getDisplayText() {
		return "Fleeting Notes";
	}

	getIcon() {
		return "list-checks";
	}

	async onOpen() {
		this.component = mount(FleetingNotesPageComponent, {
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
