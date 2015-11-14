/// <reference path="../../bower/minto/libs/jsdictionary/jsdictionary.d.ts" />
/// <reference path="../../bower/minto/libs/minto/minto_core.d.ts" />

// GreenSock Animation Platform (GSAP) - http://www.greensock.com/get-started-js/
// JavaScript Docs http://api.greensock.com/js/
// Version 1.1 (TypeScript 0.9)
declare module gs
{
    class Draggable
    {
        constructor(target:Object, vars:Object);

        public static create(target:Object, vars:Object):any[];
        public static get(target:Object):Draggable;

        public disable():Draggable;
        public enable():Draggable;
        public kill():Draggable;
        public update(applyBounds?:Boolean):Draggable;
    }
}
