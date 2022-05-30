import {Plugin, WorkspaceLeaf} from 'obsidian';
import {addIndexClass, isIndex} from "./src/helpers";

interface Settings {
	name: string;
}

export interface FileItem {
	titleEl: HTMLElement;
}

const DEFAULT_SETTINGS: Settings = {
	name: 'default'
}

export default class MyPlugin extends Plugin {
	settings: Settings;

	async onload() {
		await this.loadSettings();
		this.app.workspace.onLayoutReady(() => this.initialize());
	}

	onunload() {

	}

	async initialize() {
		const fileExplorerLeaf = await this.getFileExplorerLeaf();
		const fileItems: { [path: string]: FileItem } = (
			fileExplorerLeaf.view as any
		).fileItems;

		for (const path in fileItems) {
			const item = fileItems[path];
			if (isIndex(item)) {
				addIndexClass(item);
			}
		}
	};

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	private async getFileExplorerLeaf(): Promise<WorkspaceLeaf> {
		return new Promise((resolve, reject) => {
			let foundLeaf: WorkspaceLeaf | null = null;
			this.app.workspace.iterateAllLeaves((leaf) => {
				if (foundLeaf) {
					return;
				}

				const view = leaf.view as any;
				if (!view || !view.fileItems) {
					return;
				}

				foundLeaf = leaf;
				resolve(foundLeaf);
			});

			if (!foundLeaf) {
				reject(Error("Could not find file explorer leaf."));
			}
		});
	}
}
