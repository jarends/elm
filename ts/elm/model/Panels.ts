module elm
{
    export class Panels extends minto.Actor
    {
        public context:ElmContext
        public panelMap:any;


        constructor(context:ElmContext)
        {
            super(context);
            this.panelMap = {};
        }




        public add(panel:ElmPanel):void
        {
            if(!panel)
                return;

            this.panelMap[panel.id] = panel;
        }




        public remove(panel:ElmPanel):void
        {
            if(!panel)
                return;

            delete this.panelMap[panel.id];
        }




        public get(id:string):ElmPanel
        {
            return this.panelMap[id];
        }
    }
}
