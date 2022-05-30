import {MarkdownRenderChild} from "obsidian";
import {FileHelper} from "../helpers/FileHelper";

export class Folders extends MarkdownRenderChild {

	filePath: string;
	fileHelper: FileHelper;

	constructor(containerEl: HTMLElement, filePath: string, fileHelper: FileHelper) {
		super(containerEl);
		this.filePath = filePath;
		this.fileHelper = fileHelper;
	}

	onload() {
		const folderList = this.fileHelper.getFoldersIn(this.filePath);
		if (folderList.length > 0) {
			const ul = this.containerEl.createEl('ul');
			for (const folder of folderList) {
				const li = this.containerEl.createEl('li');
				const link = this.containerEl.createEl('a', {
					href: folder.rootPath + '/' + folder.name + '/_index_.md',
					text: '📂 ' + folder.name
				});
				link.classList.add('internal-link');
				link.target = '_blank';
				link.rel = 'noopener';
				link.setAttribute('aria-label-position', 'top');
				link.setAttribute('aria-label', 'top');
				li.append(link);
				ul.append(li);
			}
			this.containerEl.replaceWith(ul);
		} else {
			const empty = this.containerEl.createSpan({
				text: ''
			});
			this.containerEl.replaceWith(empty);
		}
	}
}
