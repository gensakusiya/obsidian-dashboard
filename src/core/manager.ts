import type { App, TAbstractFile } from "obsidian";

export abstract class DashboardManager<T = unknown> {
	private unsubscribers: Array<() => void> = [];
	private listeners: Set<() => void> = new Set();

	abstract FILE_FOLDER: string;

	app: App;
	data: T = {} as T;
	isLoading = true;
	error: string | null = null;

	constructor(app: App) {
		this.app = app;
	}

	private isFileRelevant(file: TAbstractFile): boolean {
		return file.path.startsWith(`${this.FILE_FOLDER}/`);
	}

	private notifyListeners() {
		for (const listener of this.listeners) {
			listener();
		}
	}

	private refreshIfRelevant = (file: TAbstractFile) => {
		if (this.isFileRelevant(file)) {
			this.refresh();
		}
	};

	private setupFileWatchers() {
		this.app.vault.on("modify", this.refreshIfRelevant);
		this.app.vault.on("create", this.refreshIfRelevant);
		this.app.vault.on("delete", this.refreshIfRelevant);
		this.app.vault.on("rename", this.refreshIfRelevant);

		// Store unsubscribers
		this.unsubscribers.push(
			() => this.app.vault.off("modify", this.refreshIfRelevant),
			() => this.app.vault.off("create", this.refreshIfRelevant),
			() => this.app.vault.off("delete", this.refreshIfRelevant),
			() => this.app.vault.off("rename", this.refreshIfRelevant)
		);
	}

	abstract getData(app: App): Promise<T>;

	async initialize(): Promise<void> {
		await this.refresh();
		this.setupFileWatchers();
	}

	async refresh(): Promise<void> {
		this.isLoading = true;
		this.error = null;

		try {
			this.data = await this.getData(this.app);
		} catch (err) {
			this.error = err instanceof Error ? err.message : "Unknown error";
		} finally {
			this.isLoading = false;
			this.notifyListeners();
		}
	}

	subscribe(listener: () => void): () => void {
		this.listeners.add(listener);

		return () => {
			this.listeners.delete(listener);
		};
	}

	destroy(): void {
		for (const unsubscribe of this.unsubscribers) {
			unsubscribe();
		}

		this.unsubscribers = [];
		this.listeners.clear();
	}
}
