import {App, MarkdownPostProcessorContext, Plugin, PluginManifest, WorkspaceLeaf} from 'obsidian';
import {addIndexClass, isIndex} from "./src/helpers";
import {Folders} from "./src/renders/Folders";
import {FileHelper} from "./src/helpers/FileHelper";

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
	fileHelper: FileHelper;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.fileHelper = new FileHelper(this.app.vault);
	}

	async onload() {
		await this.loadSettings();
		this.app.workspace.onLayoutReady(() => this.initialize());
		this.registerMarkdownPostProcessor((element, context) => this.markdownPostProcessor(element, context))
	}

	onunload() {

	}

	async markdownPostProcessor(element: HTMLElement, context: MarkdownPostProcessorContext) {
		const codeblocks = element.querySelectorAll("code");
		for (let index = 0; index < codeblocks.length; index++) {
			const codeblock = codeblocks.item(index);
			const text = codeblock.innerText.trim();
			if (text === '{{folders}}') {
				context.addChild(new Folders(codeblock, context.sourcePath, this.fileHelper));
			}
		}
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
