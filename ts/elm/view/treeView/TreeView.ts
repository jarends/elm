module elm
{
    export class TreeView extends minto.Actor
    {
        public flattener:TreeFlattener;
        public selector:TreeSelector;
        public keyManager:TreeKeyManager;
        public dragManager:TreeDnDManager;
        public view:HTMLDivElement;
        public contentView:HTMLDivElement;
        public renderers:TreeRenderer[];
        public cache:TreeRenderer[];
        public eventMap:minto.EventMap;
        public drawTimeout:number;

        public viewportRect:Rect;
        public contentRect:Rect;
        public startIndex:number;
        public endIndex:number;
        public totalHeight:number;
        public rhrg:number;
        public rowHeight:number;
        public rowGap:number;
        public scrollY:number;




        //    000000000  00000000   00000000  00000000  000   000  000  00000000  000   000
        //       000     000   000  000       000       000   000  000  000       000 0 000
        //       000     0000000    0000000   0000000    000 000   000  0000000   000000000
        //       000     000   000  000       000          000     000  000       000   000
        //       000     000   000  00000000  00000000      0      000  00000000  00     00

        constructor(context:minto.Context)
        {
            super(context);

            this.view          = document.createElement("div");
            this.view.tabIndex = 0;
            this.contentView   = document.createElement("div");
            this.flattener     = new TreeFlattener(this);
            this.selector      = new TreeSelector(this);
            this.keyManager    = new TreeKeyManager(this);
            this.dragManager   = new TreeDnDManager(this);
            this.eventMap      = new minto.EventMap();
            this.renderers     = [];
            this.cache         = [];
            this.viewportRect  = new Rect();
            this.contentRect   = new Rect();
            this.rowHeight     = 20;
            this.rowGap        = 2;
            this.startIndex    = 0;
            this.endIndex      = 0;

            this.contentView.style.height = 0 + "px";
            this.contentView.style.width  = 100 + "%";
            this.contentView.classList.add("elm-tree-view-content");

            this.view.classList.add("elm-tree-view");
            this.view.appendChild(this.contentView);

            this.eventMap.mapEvent(window,    "resize",  (event:any) => { this.draw(); });
            this.eventMap.mapEvent(this.view, "scroll",  (event:any) => { this.draw(); });

            this.draw();
        }




        //    0000000    00000000    0000000   000   000
        //    000   000  000   000  000   000  000 0 000
        //    000   000  0000000    000000000  000000000
        //    000   000  000   000  000   000  000   000
        //    0000000    000   000  000   000  00     00

        public draw():void
        {
            clearTimeout(this.drawTimeout);
            if(!isNaN(this.scrollY) && this.scrollY != this.view.scrollTop)
                this.view.scrollTop = this.scrollY;
            this.scrollY = NaN;

            var contentView:HTMLElement  = this.contentView,
                list:TreeNode[]          = this.flattener.list,
                l:number                 = list.length,
                vb:Rect                  = elm.getBounds(this.view, this.viewportRect),
                cb:Rect                  = elm.getBounds(contentView, this.contentRect),
                bb:Rect                  = elm.getBounds(document.body),
                rh:number                = this.rowHeight,
                rg:number                = this.rowGap,
                vh:number                = bb.height,
                ch:number                = cb.height,
                cy:number                = vb.y - cb.y,
                rhrg:number              = this.rhrg        = rh + rg,
                th:number                = this.totalHeight = rhrg * l - rg,
                startIndex:number        = this.startIndex  = Math.max(Math.floor(cy / rhrg), 0),
                endIndex:number          = this.endIndex    = Math.min(Math.floor((cy + vb.height) / rhrg), l - 1),
                secureIndex:number       = Math.min(Math.floor((cy + vh) / rhrg), l - 1),
                renderers:TreeRenderer[] = [],
                cache:TreeRenderer[]     = this.renderers,
                renderer:TreeRenderer,
                node:TreeNode,
                i:number,
                y:number;

            for(i = startIndex; i <= secureIndex; ++i)
            {
                y          = i * rhrg;
                node       = list[i];
                //node.index = i;
                renderer   = cache.shift();
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
                renderer = cache.shift();
                contentView.removeChild(renderer.view);
                this.cache.push(renderer);
            }

            this.renderers = renderers;

            if(ch != th)
                this.contentView.style.height = th + "px";
        }




        //     0000000  00000000  000   000  000000000  00000000  00000000
        //    000       000       0000  000     000     000       000   000
        //    000       0000000   000 0 000     000     0000000   0000000
        //    000       000       000  0000     000     000       000   000
        //     0000000  00000000  000   000     000     00000000  000   000

        public centerNode(node:TreeNode):void
        {

        }




        //    000   000  000   0000000  000  0000000    000      00000000
        //    000   000  000  000       000  000   000  000      000
        //     000 000   000  0000000   000  0000000    000      0000000
        //       000     000       000  000  000   000  000      000
        //        0      000  0000000   000  0000000    0000000  00000000

        public ensureNodeIsVisible(node:TreeNode):void
        {
            var index:number = node.index;
            if(index == -1)
                return;

            var vb:Rect      = this.viewportRect,
                cb:Rect      = this.contentRect,
                rhrg:number  = this.rhrg,
                th:number    = this.totalHeight,
                nodeY:number = this.rhrg * index,
                vy:number    = vb.y,
                cy:number    = cb.y,
                vh:number    = vb.height,
                minY:number  = 0,
                maxY:number  = -vh + th;

            if(index <= this.startIndex + 1)
            {
                this.scrollY = Math.max(Math.min(nodeY - rhrg, maxY), minY);
            }
            else if(index >= this.endIndex - 1)
            {
                this.scrollY = Math.max(Math.min(nodeY + 2 * rhrg - vh, maxY), minY);
            }
        }



        //    000       0000000   000000000  00000000  00000000
        //    000      000   000     000     000       000   000
        //    000      000000000     000     0000000   0000000
        //    000      000   000     000     000       000   000
        //    0000000  000   000     000     00000000  000   000

        public drawLater():void
        {
            clearTimeout(this.drawTimeout);
            this.drawTimeout = setTimeout(() => { this.draw(); }, 1);
        }
    }
}
