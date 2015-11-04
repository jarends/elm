module elm
{
    export interface ITreeRendere
    {
        node:TreeNode;
        view:HTMLElement;
        iconView:HTMLElement;
        labelView:HTMLElement;
        valueView:HTMLElement;
        treeView:TreeView;
    }



    export class TreeRenderer implements ITreeRendere
    {
        public node:TreeNode;
        public view:HTMLElement;
        public iconView:HTMLElement;
        public labelView:HTMLElement;
        public valueView:HTMLElement;
        public treeView:TreeView;
        public eventMap:minto.EventMap;


        constructor(treeView:TreeView)
        {
            this.treeView = treeView;
            this.view     = document.createElement("div");
            this.view.className = "tree-renderer";

            this.iconView = document.createElement("span");
            this.iconView.className = "elm-tree-renderer-icon";

            this.labelView = document.createElement("span");
            this.labelView.className = "elm-tree-renderer-label";

            this.valueView = document.createElement("span");
            this.valueView.className = "elm-tree-renderer-value";

            this.view.appendChild(this.iconView);
            this.view.appendChild(this.labelView);
            this.view.appendChild(this.valueView);

            this.eventMap = new minto.EventMap();
            this.eventMap.mapEvent(this.view, "click", this.clickHandler, this);
        }


        public setData(node:TreeNode):void
        {
            this.node = node;
            this.updateLabel();
        }



        public updateLabel():void
        {
            var node:TreeNode              = this.node;
            var isValue:boolean            = node.type == "value";
            var depth:number               = this.treeView.flattener.showRoot ? node.depth : node.depth - 1;
            this.iconView.textContent      = isValue ? "" : node.expanded ? "▼" : "▶";;
            this.labelView.textContent     = node.name + ":";
            this.valueView.textContent     = isValue ? node.value : "";
            this.iconView.style.marginLeft = (depth * 25) + "px";
        }




        public clickHandler(event:MouseEvent):void
        {
            if(this.node.expanded)
                this.treeView.flattener.collapse(this.node, event.metaKey);
            else
                this.treeView.flattener.expand(this.node, event.metaKey);

            this.treeView.draw();
        }
    }
}
