import {TFolder, Vault} from "obsidian";

interface Folder {
	name: string;
	rootPath: string;
}

export class FileHelper {
	vault: Vault;

	constructor(vault: Vault) {
		this.vault = vault;
	}

	getFoldersIn(filePath: string): Folder[] {
		const parent = this.vault.getAbstractFileByPath(filePath).parent;
		const rootPath = parent.path;
		const siblings = parent.children;
		return siblings
			.filter(item => item instanceof TFolder)
			.map(item => ({
					name: item.path.split('/').last(),
					rootPath
				})
			);
	}
}
