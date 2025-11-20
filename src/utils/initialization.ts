import { App, TFolder } from "obsidian";
import {
	FLEETING_NOTES_FOLDER,
	FLEETING_NOTES_INBOX_FILE,
} from "../fleeting-notes/consts";

const FOLDERS = {
	FLEETING_NOTES: FLEETING_NOTES_FOLDER,
	DAILY: "Daily",
	PROJECTS: "Projects",
	GOALS: "Goals",
};

const FILES = {
	FLEETING_NOTES_INBOX: {
		folder: FOLDERS.FLEETING_NOTES,
		name: FLEETING_NOTES_INBOX_FILE,
	},
};

export async function initializeVaultStructure(app: App): Promise<void> {
	console.log("[Dashboard] Waiting for workspace to be ready...");

	// Iterate through all required folders
	for (const folderPath of Object.values(FOLDERS)) {
		try {
			const abstractFile = app.vault.getAbstractFileByPath(folderPath);

			// If it's a folder, all good
			if (abstractFile instanceof TFolder) {
				continue;
			}

			// If it's a file, not a folder
			if (abstractFile && !(abstractFile instanceof TFolder)) {
				console.warn(
					`[Dashboard] ⚠ Warning: ${folderPath} exists but is not a folder`
				);
				continue;
			}

			// Folder doesn't exist, try to create it
			try {
				await app.vault.createFolder(folderPath);
			} catch (createError: any) {
				// If it fails because folder already exists, that's fine
				if (createError.message?.includes("already exists")) {
					console.log(
						`[Dashboard] ✓ Folder exists: ${folderPath} (confirmed via creation attempt)`
					);
				} else {
					throw createError;
				}
			}
		} catch (error) {
			console.error(
				`[Dashboard] ❌ Error processing folder ${folderPath}:`,
				error
			);
		}
	}

	// Create required files
	for (const [key, fileConfig] of Object.entries(FILES)) {
		try {
			const filePath = `${fileConfig.folder}/${fileConfig.name}`;
			const existingFile = app.vault.getAbstractFileByPath(filePath);

			// If file already exists, skip
			if (existingFile) {
				continue;
			}

			// Create the file with initial content
			try {
				await app.vault.create(filePath, getFileContent(key));
				console.log(`[Dashboard] ✓ Created file: ${filePath}`);
			} catch (createError: any) {
				// If it fails because file already exists, that's fine
				if (createError.message?.includes("already exists")) {
					console.log(
						`[Dashboard] ✓ File exists: ${filePath} (confirmed via creation attempt)`
					);
				} else {
					throw createError;
				}
			}
		} catch (error) {
			console.error(
				`[Dashboard] ❌ Error processing file ${key}:`,
				error
			);
		}
	}

	console.log("[Dashboard] ✅ Vault structure check complete!");
}

/**
 * Get initial content for a file based on its key
 */
function getFileContent(fileKey: string): string {
	switch (fileKey) {
		case "FLEETING_NOTES_INBOX":
			return `# Inbox

Add your fleeting notes here. You can optionally add dates in YYYY-MM-DD format:

- [ ] Note without a date
- [ ] Note for specific date @2025-01-15
- [ ] Another note 2025-01-20
`;
		default:
			return "";
	}
}
