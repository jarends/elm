module elm
{
    export class ElmPanel extends minto.Context
    {
        public context:ElmContext;
        public eventMap:minto.EventMap;
        public data:any;
        public tree:TreeView;
        public detachTimeout:number;




        constructor(id:string, view:HTMLElement, app:EventEmitter)
        {
            super(id);
            this.view     = view;
            this.eventMap = new minto.EventMap();

            if(this.view)
                this.view.tabIndex = 0;

            console.log("ElmPanel.constructor: " + this.id);
            this.initElm(app);
        }




        public initElm(app:EventEmitter):void
        {
            if(!elm.context)
            {
                elm.context = new elm.ElmContext('Elm[' + Math.random() + ']', app)
                elm.context.startup();
            }

            elm.context.panels.add(this);
        }




        public startup(data:any):void
        {
            //this.data = {test:[data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data, data]};//, data, data, data, data, data, data, data, data, data, data]};
            this.data = [data];

            console.log("ElmPanel.startup: " + this.id);

            this.tree = new TreeView(this);
            this.view.appendChild(this.tree.view);
            this.tree.flattener.setRoot(this.data);
            this.tree.flattener.expandAll();
            this.tree.selector.setActive(this.tree.flattener.getFirst());
            this.tree.view.focus();

            var length:number = this.tree.flattener.list.length;
            var height:number = length * (this.tree.rowHeight + this.tree.rowGap);
            console.log(`ElmPanel.startup: created list with ${length} items and height of ${height}px`);

            this.eventMap.mapEvent(this.view, "focus", () => { this.tree.view.focus(); });
        }




        public detachLater():void
        {
            clearTimeout(this.detachTimeout);
            this.detachTimeout = setTimeout(() =>
            {
                if(this.view && !this.view.parentElement) this.dispose();
            }, 0);
        }


        public dispose():void
        {
            console.log("ElmPanel.dispose: " + this.id);
            elm.context.panels.remove(this);
        }
    }
}
