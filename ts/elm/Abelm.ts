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
            data = {root:a};

            //var container:HTMLElement = document.createElement("div");
            //container.classList.add("elm-container");

            var treeView:TreeView = new elm.TreeView(this);
            //treeView.view.style.paddingRight = "2px";
            treeView.flattener.setRoot(data);
            treeView.flattener.expandAll();

            /*
            var treeView1:TreeView = new elm.TreeView(this);
            treeView1.view.style.left = "50%";
            treeView1.view.style.paddingLeft = "1px";
            treeView1.flattener.setRoot(data);
            treeView1.flattener.expandAll();
            */

            //container.appendChild(treeView.view);
            //container.appendChild(treeView1.getView());
            //this.view.appendChild(container);
            this.view.appendChild(treeView.view); 

            treeView.draw();
            //treeView1.draw();
        }



        public dispose():void
        {
            console.log("Abelm.dispose!!!");
        }
    }
}
