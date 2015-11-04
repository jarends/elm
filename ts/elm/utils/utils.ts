module elm
{
    export class Rect
    {
        public x:number;
        public y:number;
        public width:number;
        public height:number;
        public left:number;
        public right:number;
        public top:number;
        public bottom:number;


        constructor(x?:number, y?:number, width?:number, height?:number)
        {
            if(isNaN(x))
                return;
            this.set(x, y, width, height);
        }


        public set(x:number, y:number, width:number, height:number):void
        {
            this.x      = x;
            this.y      = y;
            this.width  = width;
            this.height = height;
            this.updateBounds();
        }


        public updateBounds():void
        {
            this.left   = this.x;
            this.right  = this.x + this.width;
            this.top    = this.y;
            this.bottom = this.y + this.height;
        }


        public hitTest(x:number, y:number):boolean
        {
            return x >= this.left && x <= this.right
                && y >= this.top  && y <= this.bottom;
        }


        public intersection(other:Rect):number
        {
            var l:number = this.left   > other.left   ? this.left   : other.left;
            var r:number = this.right  < other.right  ? this.right  : other.right;
            var t:number = this.top    > other.top    ? this.top    : other.top;
            var b:number = this.bottom < other.bottom ? this.bottom : other.bottom;

            if(l > r || t > b)
                return 0;

            return (r - l) * (b - t);
        }


        public intersectionPersent(other:Rect):number
        {
            return this.intersection(other) / (this.width * this.height);
        }
    }



    export function getBounds(view:HTMLElement, rect?:Rect):Rect
    {
        var elemRect     = view.getBoundingClientRect(),
            bodyRect     = document.body.getBoundingClientRect(),
            offsetLeft   = elemRect.left - bodyRect.left,
            offsetTop    = elemRect.top  - bodyRect.top,
            offsetWidth  = elemRect.width,
            offsetHeight = elemRect.height;

        if(!rect)
            rect = new Rect(offsetLeft, offsetTop, offsetWidth, offsetHeight);
        else
            rect.set(offsetLeft, offsetTop, offsetWidth, offsetHeight);

        return rect;
    }
}
