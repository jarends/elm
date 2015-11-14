module elm
{
    export class TreeDnDManager
    {
        public treeView:TreeView;
        public eventMap:minto.EventMap;




        constructor(treeView:TreeView)
        {
            this.treeView = treeView;
            this.eventMap = new minto.EventMap();
            this.eventMap.mapEvent(treeView.view, "dragstart", this.dragStartHandler, this, true); 
            this.eventMap.mapEvent(treeView.view, "drag",      this.dragHandler,      this, true);
            this.eventMap.mapEvent(treeView.view, "dragend",   this.dragEndHandler,   this, true);

            this.eventMap.mapEvent(treeView.view, "dragenter", this.dragEnterHandler, this, true);
            this.eventMap.mapEvent(treeView.view, "dragover",  this.dragOverHandler,  this, true);
            this.eventMap.mapEvent(treeView.view, "dragleave", this.dragLeaveHandler, this, true);
            this.eventMap.mapEvent(treeView.view, "drop",      this.dropHandler,      this, true);
        }




        public addListeners():void
        {

        }


        public dispose():void
        {
            this.eventMap.unmapEvents();
        }




        public dragStartHandler(event:DragEvent):void
        {
            event.dataTransfer.setData("tree data", this.treeView.context.id);
            console.log("dragStartHandler: ", event);
        }


        public dragHandler(event:DragEvent):void
        {
            //event.preventDefault();
            //event.stopImmediatePropagation();
            console.log("dragHandler: ", event);
        }


        public dragEndHandler(event:DragEvent):void
        {
            event.preventDefault();
            event.stopImmediatePropagation();
            console.log("dragEndHandler: ", event);
        }




        public dragEnterHandler(event:DragEvent):void
        {
            //event.preventDefault();
            //event.stopImmediatePropagation();
            console.log("dragEnterHandler: ", event);
        }




        public dragOverHandler(event:DragEvent):void
        {
            //event.preventDefault();
            //event.stopImmediatePropagation();
            //console.log("dragOverHandler: ", event);
        }




        public dragLeaveHandler(event:DragEvent):void
        {
            //event.preventDefault();
            //event.stopImmediatePropagation();
            console.log("dragLeaveHandler: ", event);
        }


        public dropHandler(event:DragEvent):void
        {
            event.preventDefault();
            event.stopImmediatePropagation();

            var transfer:DataTransfer = event.dataTransfer;
            var data:string = transfer.getData("tree data");
            console.log("drop: ", data, transfer.types, transfer.items, transfer.files);
        }
    }
}
