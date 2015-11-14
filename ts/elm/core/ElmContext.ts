module elm
{
    export var context:ElmContext;




    export class ElmContext extends minto.Context
    {
        public panels:Panels;
        public emitter:ElmEmitter;
        public app:EventEmitter;




        constructor(id:string, app:EventEmitter)
        {
            super(id);
            console.log("ElmWindow.constructor");

            if(elm.context)
                throw new Error("Elm ERROR: context alredy created! " + elm.context.id);
            elm.context = this;
            this.app    = app;
        }




        public startup():void
        {
            console.log("ElmWindow.startup: " + this.id);
            this.emitter = new ElmEmitter(this);
            this.panels  = new Panels(this);


            /*
            window.onbeforeunload = (e) =>
            {
                e.preventDefault();
                e.returnValue = "false";
                setTimeout(() =>
                {
                    window.onbeforeunload = null;
                    for(var id in this.panels.panelMap)
                        this.panels.panelMap[id].dispose();
                    this.dispose();
                }, 100);
            };
            */
        }




        public dispose():void
        {
            console.log("ElmWindow.dispose: " + this.id);
            this.emitter.dispose();
        }
    }
}
