/// <reference path="../bower/minto/libs/jsdictionary/jsdictionary.d.ts" />
/// <reference path="../bower/minto/libs/minto/minto_core.d.ts" />
/// <reference path="../ts/elm/draggable.d.ts" />
declare module elm {
    class Abelm extends minto.Context {
        constructor(id: string, data: any, view: HTMLDivElement);
        startup(data: any): void;
        dispose(): void;
    }
}
declare module elm {
    interface VO {
        uid: string;
        clazz: string;
        name: string;
        parent: VO;
        children: VO[];
    }
}
declare module elm {
    class Rect {
        x: number;
        y: number;
        width: number;
        height: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        set(x: number, y: number, width: number, height: number): void;
        updateBounds(): void;
        hitTest(x: number, y: number): boolean;
        intersection(other: Rect): number;
        intersectionPersent(other: Rect): number;
    }
    function getBounds(view: HTMLElement, rect?: Rect): Rect;
}
declare module elm {
    class TreeNode {
        name: string;
        type: string;
        owner: TreeNode;
        depth: number;
        selected: boolean;
        expanded: boolean;
        parsed: boolean;
        value: any;
        children: TreeNode[];
    }
    class TreeFlattener {
        treeView: TreeView;
        root: TreeNode;
        showRoot: boolean;
        list: TreeNode[];
        cache: TreeNode[];
        working: boolean;
        constructor(treeView: TreeView);
        setRoot(root: VO): void;
        expand(node: TreeNode, recursive?: boolean): void;
        collapse(node: TreeNode, recursive?: boolean): void;
        expandAll(): void;
        collapseAll(): void;
        addChildren(node: TreeNode, recursive: boolean, list: TreeNode[]): void;
        removeChildren(node: TreeNode, recursive: boolean, removeFromExpanded: boolean, count: number): number;
        getNode(owner: TreeNode, name: string, value: any): TreeNode;
        parseNode(node: TreeNode): void;
        clearAll(): void;
        clearNode(node: TreeNode): void;
        dispose(): void;
        update(): void;
    }
}
declare module elm {
    interface ITreeRendere {
        node: TreeNode;
        view: HTMLElement;
        iconView: HTMLElement;
        labelView: HTMLElement;
        valueView: HTMLElement;
        treeView: TreeView;
    }
    class TreeRenderer implements ITreeRendere {
        node: TreeNode;
        view: HTMLElement;
        iconView: HTMLElement;
        labelView: HTMLElement;
        valueView: HTMLElement;
        treeView: TreeView;
        eventMap: minto.EventMap;
        isOver: boolean;
        isDown: boolean;
        constructor(treeView: TreeView);
        setData(node: TreeNode): void;
        updateData(): void;
        iconClickHandler(event: MouseEvent): void;
        clickHandler(event: MouseEvent): void;
        mouseOverHandler(event: MouseEvent): void;
        mouseOutHandler(event: MouseEvent): void;
        mouseDownHandler(event: MouseEvent): void;
        mouseUpHandler(event: MouseEvent): void;
    }
}
declare module elm {
    class TreeSelector {
        treeView: TreeView;
        selectedNodes: TreeNode[];
        selectedNode: TreeNode;
        constructor(treeView: TreeView);
        select(node: TreeNode): void;
    }
}
declare module elm {
    class TreeView extends minto.Actor {
        flattener: TreeFlattener;
        selector: TreeSelector;
        view: HTMLDivElement;
        contentView: HTMLDivElement;
        renderers: TreeRenderer[];
        cache: TreeRenderer[];
        eventMap: minto.EventMap;
        rowHeight: number;
        rowGap: number;
        constructor(abelm: Abelm);
        getView(): HTMLDivElement;
        draw(): void;
    }
}
