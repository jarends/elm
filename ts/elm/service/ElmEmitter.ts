module elm
{
    export interface EventEmitter
    {
        addListener:(event:string, callback:(...args:any[]) => any) => void;
        removeAllListeners:(event:string) => void;
        emit:(event:string, ...args:any[]) => void;
    }




    export class ElmEmitter
    {
        public context:ElmContext;
        public id:string;
        public app:EventEmitter;
        public dispatcher:minto.Dispatcher;
        public instances:string[];
        public reconnectTimeout:number;
        public eventMap:minto.EventMap;




        constructor(context:ElmContext)
        {
            this.context    = context;
            this.id         = context.id;
            this.app        = context.app;
            this.dispatcher = context.dispatcher;
            this.eventMap   = new minto.EventMap();
            this.instances  = [];
            this.connect();
        }




        public connect():void
        {
            console.log("ElmEmitter.connect");
            this.eventMap.mapEvent(this.context.dispatcher, "hello",  this.helloHandler, this);
            this.eventMap.mapEvent(this.context.dispatcher, "goodby", this.goodbyHandler, this);

            this.addListeners();
            this.toOther("hello", this.context.id);
        }




        public addListeners():void
        {
            console.log("ElmEmitter.addListeners");
            this.app.addListener("elm.emit." + this.id, (data:any) => { this.toInstanceHandler(data); });
            this.app.addListener("elm.emit.all",        (data:any) => { this.toAllHandler(data); });
            this.app.addListener("elm.emit.other",      (data:any) => { this.toOtherHandler(data); });
        }




        public toInstance(id:string, event:string, ...args:any[]):void
        {
            console.log("ElmEmitter.toInstance:", id, args);
            this.context.app.emit("elm.emit." + id, { event:event, args:args });
        }




        public toAll(event:string, ...args:any[]):void
        {
            console.log("ElmEmitter.toAll:", args);
            this.context.app.emit("elm.emit.all", { event:event, args:args });
        }




        public toOther(event:string, ...args:any[]):void
        {
            console.log("ElmEmitter.toOther:", args);
            this.context.app.emit("elm.emit.other", { event:event, args:args, from:this.id });
        }




        public dispose():void
        {
            console.log("ElmEmitter.dispose");
            this.toOther("goodby", this.id);
            this.eventMap.unmapEvents();

            this.app.removeAllListeners("elm.emit." + this.id);
            this.app.removeAllListeners("elm.emit.all");
            this.app.removeAllListeners("elm.emit.other");
        }




        public toInstanceHandler(data:any):void
        {
            //console.log("ElmEmitter.toInstanceHandler: ", data);
            var args:any[] = data.args || [];
            args.unshift(data.event);
            this.dispatcher.dispatch.apply(this.dispatcher, args);
        }




        public toAllHandler(data:any):void
        {
            //console.log("ElmEmitter.toAllHandler: ", data);
            var args:any[] = data.args || [];
            args.unshift(data.event);
            this.dispatcher.dispatch.apply(this.dispatcher, args);
        }




        public toOtherHandler(data:any):void
        {
            //console.log("ElmEmitter.toOtherHandler: ", data);
            var args:any[]  = data.args || [],
                from:string = data.from;

            if(from != this.id)
            {
                args.unshift(data.event);
                this.dispatcher.dispatch.apply(this.dispatcher, args);
            }
        }




        public helloHandler(event:string, id:string):void
        {
            var index:number = this.instances.indexOf(id);
            if(index == -1)
            {
                console.log("ElmEmitter.hello: " + id);
                this.instances.push(id);
                this.toInstance(id, "hello", this.id);
            }
        }




        public goodbyHandler(event:string, id:string):void
        {
            var index:number = this.instances.indexOf(id);
            if(index > -1)
            {
                console.log("ElmEmitter.goodby: " + id);
                this.instances.splice(index, 1);
            }
            clearTimeout(this.reconnectTimeout);
            setTimeout(() => { this.addListeners(); }, 100);
        }
    }
}
