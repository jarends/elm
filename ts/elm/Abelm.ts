module elm
{
    export class Abelm extends minto.Context
    {
        constructor(id:string, data:any, view:HTMLDivElement)
        {
            super(id);
            console.log("Abelm constructor");
            this.view = view;
            this.startup(data);
        }




        public startup(data:any):void
        {
            console.log("Abelm startup:");

            //this.view.style.overflow = "auto";

            var a:any[] = [],
                i, l;
            for(i = 0; i < 5; ++i)
            {
                a.push(data);
            }
            //data = {root:a};
            var treeView:TreeView = new elm.TreeView(this);
            treeView.flattener.setRoot(data);
            //treeView.flattener.expandAll();
            console.log("TOTAL NODES: " + treeView.flattener.list.length);

            console.log("TreeFlattener.setRoot: " + treeView.flattener.list.length + ", " + (treeView.flattener.list.length * (treeView.rowHeight + treeView.rowGap)));

            this.view.appendChild(treeView.getView());
            setTimeout(() => { treeView.draw(); }, 1);

            console.log("it works: ;-) ", treeView.flattener.root);
        }
    }
}
