module elm
{
    export class TreeKeyManager
    {
        public treeView:TreeView;
        public eventMap:minto.EventMap;




        constructor(treeView:TreeView)
        {
            this.treeView        = treeView;
            this.eventMap        = new minto.EventMap();
            this.addListeners();
        }




        public addListeners():void
        {
            var view:HTMLElement = this.treeView.view;
            this.eventMap.mapEvent(view, "keydown", this.keyDownHandler, this);
            this.eventMap.mapEvent(view, "keyup",   this.keyUpHandler,   this);
        }


        public dispose():void
        {
            this.eventMap.unmapEvents();
        }




        public keyDownHandler(event:KeyboardEvent):void
        {
            switch(event.keyCode)
            {
                case 37: this.arrowLeft      (event); break;
                case 38: this.arrowUp        (event); break;
                case 39: this.arrowRight     (event); break;
                case 40: this.arrowDown      (event); break;
                case 32: this.toggleSelection(event); break;
            }
        }




        public keyUpHandler(event:KeyboardEvent):void
        {
        }




        public arrowUp(event:KeyboardEvent):void
        {
            var active:TreeNode  = this.treeView.selector.activeNode,
                next:TreeNode    = this.treeView.flattener.getUp(active);

            if(next)
                this.navigate(next, event.metaKey, event.shiftKey);
            else
                this.navigate(this.treeView.flattener.getLast(), event.metaKey, event.shiftKey);
        }


        public arrowDown(event:KeyboardEvent):void
        {
            var active:TreeNode  = this.treeView.selector.activeNode,
                next:TreeNode    = this.treeView.flattener.getDown(active);

            if(next)
                this.navigate(next, event.metaKey, event.shiftKey);
            else
                this.navigate(this.treeView.flattener.getFirst(), event.metaKey, event.shiftKey);
        }


        public arrowLeft(event:KeyboardEvent):void
        {
            var active:TreeNode  = this.treeView.selector.activeNode,
                next:TreeNode    = this.treeView.flattener.getUp(active);

            if(active && active.expanded)
                this.treeView.flattener.collapse(active, event.metaKey);
            else if(next)
                this.navigate(next, event.metaKey, event.shiftKey);
        }


        public arrowRight(event:KeyboardEvent):void
        {
            var active:TreeNode  = this.treeView.selector.activeNode,
                next:TreeNode    = this.treeView.flattener.getDown(active);

            if(active && !active.expanded && active.children && active.children.length)
                this.treeView.flattener.expand(active, event.metaKey);
            else if(next)
                this.navigate(next, event.metaKey, event.shiftKey);
        }


        public navigate(next:TreeNode, metaKey:boolean, shiftKey:boolean):void
        {
            var selector:TreeSelector = this.treeView.selector;

            if(metaKey || shiftKey)
                selector.selectByKey(next, metaKey, shiftKey, true);

            else if(selector.selectedNodes.length == 1)
                selector.select(next);

            else
                selector.setActive(next);

            this.treeView.ensureNodeIsVisible(next);
        }


        public toggleSelection(event:KeyboardEvent):void
        {
            this.treeView.selector.toggleActive();
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }
}
