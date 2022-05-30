import {FileItem} from "../main";

export const getFirstChild = (fileItem: FileItem): Element | undefined => {
	return fileItem.titleEl.children[0];
}

export const isIndex = (fileItem: FileItem): boolean => {
	const firstChild = getFirstChild(fileItem);
	return firstChild?.innerHTML === '_index_';
}

export const addIndexClass = (fileItem: FileItem) => {
	const firstChild = getFirstChild(fileItem);
	firstChild?.addClass('_index_');
}
