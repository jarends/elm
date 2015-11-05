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
        public isOver:boolean;
        public isDown:boolean;


        constructor(treeView:TreeView)
        {
            this.treeView = treeView;
            this.view     = document.createElement("div");
            this.view.className = "elm-tree-renderer";
            this.view.tabIndex  = -1;
            
            this.iconView = document.createElement("span");
            this.iconView.className = "elm-tree-renderer-icon";

            this.labelView = document.createElement("span");
            this.labelView.className = "elm-tree-renderer-label";

            this.valueView = document.createElement("span");
            this.valueView.className = "elm-tree-renderer-value";

            this.view.appendChild(this.iconView);
            this.view.appendChild(this.labelView);
            this.view.appendChild(this.valueView);

            this.view.tabIndex = -1;

            this.eventMap = new minto.EventMap();

            this.eventMap.mapEvent(this.view,     "click",     this.clickHandler,     this);
            this.eventMap.mapEvent(this.view,     "mouseover", this.mouseOverHandler, this);
            this.eventMap.mapEvent(this.view,     "mouseout",  this.mouseOutHandler,  this);
            this.eventMap.mapEvent(this.view,     "mousedown", this.mouseDownHandler, this);
            this.eventMap.mapEvent(this.view,     "mouseup",   this.mouseUpHandler,   this);
            this.eventMap.mapEvent(this.iconView, "click",     this.iconClickHandler, this);
        }


        public setData(node:TreeNode):void
        {
            this.node = node;
            this.updateData();
        }



        public updateData():void
        {
            var node:TreeNode              = this.node,
                isValue:boolean            = node.type == "value",
                depth:number               = this.treeView.flattener.showRoot ? node.depth : node.depth - 1;
            this.labelView.textContent     = node.name + ":";
            this.valueView.textContent     = isValue ? node.value : "";
            this.iconView.style.marginLeft = (depth * 20 + 5) + "px";

            if(this.node.selected)
                this.view.classList.add("elm-tree-renderer-selected");
            else
                this.view.classList.remove("elm-tree-renderer-selected");

            if(this.node.expanded)
                this.iconView.classList.add("elm-tree-renderer-expanded");
            else
                this.iconView.classList.remove("elm-tree-renderer-expanded");

            if(isValue)
                this.iconView.classList.add("elm-tree-renderer-no-expand");
            else
                this.iconView.classList.remove("elm-tree-renderer-no-expand");
        }




        public iconClickHandler(event:MouseEvent):void
        {
            if(this.node.expanded)
                this.treeView.flattener.collapse(this.node, event.metaKey);
            else
                this.treeView.flattener.expand(this.node, event.metaKey);

            this.treeView.draw();
            event.stopImmediatePropagation();
        }


        public clickHandler(event:MouseEvent):void
        {
            if(!this.node.selected)
                this.treeView.selector.select(this.node);
        }


        public mouseOverHandler(event:MouseEvent):void
        {
            this.isOver = true;
            this.isDown = false;
            this.updateData();
        }


        public mouseOutHandler(event:MouseEvent):void
        {
            this.isOver = false;
            this.isDown = false;
            this.updateData();
        }


        public mouseDownHandler(event:MouseEvent):void
        {
            this.isOver = true;
            this.isDown = true;
            this.updateData();
        }


        public mouseUpHandler(event:MouseEvent):void
        {
            this.isOver = true;
            this.isDown = false;
            this.updateData();
        }
    }
}
