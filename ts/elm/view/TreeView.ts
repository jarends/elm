module elm
{
    export class TreeView extends minto.Actor
    {
        public flattener:TreeFlattener;
        public selector:TreeSelector;
        public view:HTMLDivElement;
        public contentView:HTMLDivElement;
        public renderers:TreeRenderer[];
        public cache:TreeRenderer[];
        public eventMap:minto.EventMap;
        public rowHeight:number;
        public rowGap:number;



        constructor(abelm: Abelm)
        {
            super(abelm);

            this.view          = document.createElement("div");
            this.contentView   = document.createElement("div");
            this.view.tabIndex = -1;
            this.flattener     = new elm.TreeFlattener(this);
            this.selector      = new TreeSelector(this);
            this.eventMap      = new minto.EventMap();
            this.renderers     = [];
            this.cache         = [];
            this.rowHeight     = 20;
            this.rowGap        = 2;

            this.contentView.style.height = 0 + "px";
            this.contentView.style.width  = 100 + "%";
            this.contentView.classList.add("elm-tree-view-content");

            this.view.classList.add("elm-tree-view");
            this.view.appendChild(this.contentView);

            this.eventMap.mapEvent(this.view, "scroll", (event:any) => { this.draw(); });
            this.eventMap.mapEvent(window,    "resize", (event:any) => { this.draw(); });
        }


        public getView():HTMLDivElement
        {
            return this.view;
        }




        public draw():void
        {
            var contentView:HTMLElement  = this.contentView,
                list:TreeNode[]          = this.flattener.list,
                l:number                 = list.length,
                vb:Rect                  = elm.getBounds(this.view),
                cb:Rect                  = elm.getBounds(this.contentView),
                bb:Rect                  = elm.getBounds(document.body),
                rh:number                = this.rowHeight,
                rg:number                = this.rowGap,
                rgh:number               = rh + rg,
                th:number                = rgh * l - rg,
                vh:number                = bb.height,
                ch:number                = cb.height,
                cy:number                = vb.y - cb.y,
                startIndex:number        = Math.floor(cy / rgh),
                endIndex:number          = Math.min(Math.floor((cy + vh) / rgh), l - 1),
                renderers:TreeRenderer[] = [],
                cache:TreeRenderer[]     = this.renderers,
                renderer:TreeRenderer,
                node:TreeNode,
                i:number,
                y:number;

            for(i = startIndex; i <= endIndex; ++i)
            {
                y        = i * rgh;
                node     = list[i];
                renderer = cache.shift();
                if(!renderer)
                {
                    renderer = this.cache.pop() || new TreeRenderer(this);
                    contentView.appendChild(renderer.view);
                }
                renderer.setData(node);
                renderer.view.style.top = y + "px";
                renderers.push(renderer);
            }

            while(cache.length)
            {
                renderer = cache.pop();
                contentView.removeChild(renderer.view);
                this.cache.push(renderer);
            }

            this.renderers = renderers;

            if(ch != th)
                this.contentView.style.height = th + "px";
        }
    }
}
