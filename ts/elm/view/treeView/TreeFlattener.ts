module elm
{
    //    000000000  00000000   00000000  00000000  000   000   0000000   0000000    00000000
    //       000     000   000  000       000       0000  000  000   000  000   000  000
    //       000     0000000    0000000   0000000   000 0 000  000   000  000   000  0000000
    //       000     000   000  000       000       000  0000  000   000  000   000  000
    //       000     000   000  00000000  00000000  000   000   0000000   0000000    00000000

    export class TreeNode
    {
        public name:string;
        public type:string;
        public owner:TreeNode;
        public depth:number;
        public index:number;
        public selected:boolean;
        public expanded:boolean;
        public parsed:boolean;
        public value:any;
        public children:TreeNode[];
    }


    interface ListIndex
    {
        index:number;
    }



    export class TreeFlattener
    {
        public treeView:TreeView;
        public root:TreeNode;
        public showRoot:boolean;
        public list:TreeNode[];
        public cache:TreeNode[];




        //    00000000  000       0000000   000000000  000000000  00000000  000   000  00000000  00000000
        //    000       000      000   000     000        000     000       0000  000  000       000   000
        //    000000    000      000000000     000        000     0000000   000 0 000  0000000   0000000
        //    000       000      000   000     000        000     000       000  0000  000       000   000
        //    000       0000000  000   000     000        000     00000000  000   000  00000000  000   000

        constructor(treeView:TreeView)
        {
            this.treeView = treeView;
            this.showRoot = false;
            this.list     = [];
            this.cache    = [];
        }




        //    00000000    0000000    0000000   000000000
        //    000   000  000   000  000   000     000
        //    0000000    000   000  000   000     000
        //    000   000  000   000  000   000     000
        //    000   000   0000000    0000000      000

        public setRoot(root:VO):void
        {
            if(this.root && this.root.value != root)
                this.dispose();

            if(!this.root)
                this.root = this.getNode(null, "root", root);

            this.update();
        }




        //    00000000  000   000  00000000    0000000   000   000  0000000
        //    000        000 000   000   000  000   000  0000  000  000   000
        //    0000000     00000    00000000   000000000  000 0 000  000   000
        //    000        000 000   000        000   000  000  0000  000   000
        //    00000000  000   000  000        000   000  000   000  0000000

        public expand(node:TreeNode, recursive?:boolean):void
        {
            if(!node.parsed)
                this.parseNode(node);

            var index:number = node.index;
            if(index == -1 && (node != this.root || node == null))
                return;

            var list:TreeNode[] = this.list,
                addeds:any[]    = [],
                secondList:any[],
                length:number,
                i:number,
                child:TreeNode;

            this.addChildren(node, recursive, addeds, {index:index});

            if(addeds.length)
            {
                ++index;
                secondList = list.splice(index, list.length - index);
                list       = list.concat(addeds);
                index      = list.length;
                list       = list.concat(secondList);
                length     = list.length;
                this.list  = list;

                for(i = index; i < length; ++i)
                    list[i].index = i;

            }
            this.treeView.drawLater();
        }




        //     0000000   0000000   000      000       0000000   00000000    0000000  00000000
        //    000       000   000  000      000      000   000  000   000  000       000
        //    000       000   000  000      000      000000000  00000000   0000000   0000000
        //    000       000   000  000      000      000   000  000             000  000
        //     0000000   0000000   0000000  0000000  000   000  000        0000000   00000000

        public collapse(node:TreeNode, recursive?:boolean):void
        {
            if(!node.parsed)
                this.parseNode(node);

            var index:number    = node.index,
                list:TreeNode[] = this.list,
                count:number,
                length:number,
                i:number,
                child:TreeNode;

            if(index == -1 && (node != this.root || node == null))
                return;

            count = this.removeChildren(node, recursive, true, 0);
            if(count)
            {
                list.splice(++index, count);
                length = list.length;

                for(i = index; i < length; ++i)
                    list[i].index = i;

                this.treeView.drawLater();
            }
        }




        //    00000000  000   000  00000000    0000000   000   000  0000000     0000000   000      000
        //    000        000 000   000   000  000   000  0000  000  000   000  000   000  000      000
        //    0000000     00000    00000000   000000000  000 0 000  000   000  000000000  000      000
        //    000        000 000   000        000   000  000  0000  000   000  000   000  000      000
        //    00000000  000   000  000        000   000  000   000  0000000    000   000  0000000  0000000

        public expandAll():void
        {
            if(!this.root.parsed)
                this.parseNode(this.root);

            if(this.showRoot)
            {
                this.expand(this.root, true);
                return;
            }

            var children:TreeNode[] = this.root.children;
            var l:number = children ? children.length : 0;
            var i:number;
            for(i = 0; i < l; ++i)
                this.expand(children[i], true);
        }




        //     0000000   0000000   000      000       0000000   00000000    0000000  00000000   0000000   000      000
        //    000       000   000  000      000      000   000  000   000  000       000       000   000  000      000
        //    000       000   000  000      000      000000000  00000000   0000000   0000000   000000000  000      000
        //    000       000   000  000      000      000   000  000             000  000       000   000  000      000
        //     0000000   0000000   0000000  0000000  000   000  000        0000000   00000000  000   000  0000000  0000000

        public collapseAll():void
        {
            if(!this.root.parsed)
                this.parseNode(this.root);

            if(this.showRoot)
            {
                this.collapse(this.root, true);
                return;
            }

            var children:TreeNode[] = this.root.children,
                l:number            = children ? children.length : 0,
                i:number;

            for(i = 0; i < l; ++i)
                this.collapse(children[i], true);
        }




        //     0000000   0000000    0000000
        //    000   000  000   000  000   000
        //    000000000  000   000  000   000
        //    000   000  000   000  000   000
        //    000   000  0000000    0000000

        public addChildren(node:TreeNode, recursive:boolean, list:TreeNode[], listIndex:{index:number}):void
        {
            if(!node.parsed)
                this.parseNode(node);

            node.expanded = true && node.type != "value";
            node.index    = listIndex.index;

            var children:TreeNode[] = node.children,
                l:number            = children ? children.length : 0,
                i:number,
                child:TreeNode;

            for(i = 0; i < l; ++i)
            {
                child = children[i];
                child.index = ++listIndex.index;
                list.push(child);

                if(!child.parsed)
                    this.parseNode(child);

                if(recursive || child.expanded)
                    this.addChildren(child, recursive, list, listIndex);
            }
        }




        //    00000000   00000000  00     00   0000000   000   000  00000000
        //    000   000  000       000   000  000   000  000   000  000
        //    0000000    0000000   000000000  000   000   000 000   0000000
        //    000   000  000       000 0 000  000   000     000     000
        //    000   000  00000000  000   000   0000000       0      00000000

        public removeChildren(node:TreeNode, recursive:boolean, removeFromExpanded:boolean, count:number):number
        {
            var startNode:TreeNode = node;

            if(!node.parsed)
                this.parseNode(node);

            var startCount:number = count;

            var children:TreeNode[] = node.children,
                l:number            = children ? children.length : 0,
                i:number,
                index:number,
                child:TreeNode;

            for(i = 0; i < l && node.expanded; ++i)
            {
                child = children[i];
                child.index = -1;
                if(recursive || child.expanded)
                    count += this.removeChildren(child, recursive, recursive, 0);
            }

            if(l && node.expanded)
                count += l;

            if(removeFromExpanded)
                node.expanded = false;

            return count;
        }




        //     0000000   00000000  000000000
        //    000        000          000
        //    000  0000  0000000      000
        //    000   000  000          000
        //     0000000   00000000     000

        public getNode(owner:TreeNode, name:string, value:any):TreeNode
        {
            var node:TreeNode = this.cache.pop() || new TreeNode();
            node.parsed       = false;
            node.selected     = false;
            node.expanded     = false;
            node.name         = name;
            node.value        = value;
            node.owner        = owner;
            node.depth        = owner ? owner.depth + 1 : 0;
            if(value.constructor.name == "Array")
                node.type = "array";
            else if(value.constructor.name == "Object")
                node.type = "object";
            else
                node.type = "value";

            return node;
        }




        //    00000000    0000000   00000000    0000000  00000000
        //    000   000  000   000  000   000  000       000
        //    00000000   000000000  0000000    0000000   0000000
        //    000        000   000  000   000       000  000
        //    000        000   000  000   000  0000000   00000000

        public parseNode(node:TreeNode):void
        {
            var value:any = node.value,
                children:TreeNode[],
                lst:any[],
                l:number,
                i:number,
                obj:any,
                key:string;

            if(node.type == "array")
            {
                node.type = "array";
                if(!node.children)
                    node.children = [];

                children = node.children
                lst      = value;
                l        = lst.length;
                for(i = 0; i < l; ++i)
                    children.push(this.getNode(node, i + "", lst[i]));
            }
            else if(node.type == "object")
            {
                node.type = "object";
                if(!node.children)
                    node.children = [];

                children = node.children
                obj      = value;
                for(key in obj)
                    children.push(this.getNode(node, key, obj[key]));
            }

            node.parsed = true;
        }




        //     0000000   0000000   00000000   000   000
        //    000       000   000  000   000   000 000
        //    000       000   000  00000000     00000
        //    000       000   000  000           000
        //     0000000   0000000   000           000

        public copy():string
        {
            return null;
        }




        //     0000000  000   000  000000000
        //    000       000   000     000
        //    000       000   000     000
        //    000       000   000     000
        //     0000000   0000000      000

        public cut():void
        {

        }




        //    00000000    0000000    0000000  000000000  00000000
        //    000   000  000   000  000          000     000
        //    00000000   000000000  0000000      000     0000000
        //    000        000   000       000     000     000
        //    000        000   000  0000000      000     00000000

        public paste():void
        {

        }




        //    00000000  000  00000000    0000000  000000000
        //    000       000  000   000  000          000
        //    000000    000  0000000    0000000      000
        //    000       000  000   000       000     000
        //    000       000  000   000  0000000      000

        public getFirst(node?:TreeNode):TreeNode
        {
            return this.list[0];
        }




        //    000       0000000    0000000  000000000
        //    000      000   000  000          000
        //    000      000000000  0000000      000
        //    000      000   000       000     000
        //    0000000  000   000  0000000      000

        public getLast(node?:TreeNode):TreeNode
        {
            return this.list[this.list.length - 1];
        }




        //    000   000  00000000
        //    000   000  000   000
        //    000   000  00000000
        //    000   000  000
        //     0000000   000

        public getUp(node:TreeNode, quick?:boolean):TreeNode
        {
            if(!node)
                return this.getLast();

            var index:number = node.index;
            if(index == -1)
                return null;

            return this.list[index - 1];
        }


        //    0000000     0000000   000   000  000   000
        //    000   000  000   000  000 0 000  0000  000
        //    000   000  000   000  000000000  000 0 000
        //    000   000  000   000  000   000  000  0000
        //    0000000     0000000   00     00  000   000

        public getDown(node:TreeNode):TreeNode
        {
            if(!node)
                return this.getFirst();

            var index:number = node.index;
            if(index == -1 || index >= this.list.length - 1)
                return null;

            return this.list[index + 1];
        }



        //     0000000   000   000  000   0000000  000   000  0000000     0000000   000   000  000   000
        //    000   000  000   000  000  000       000  000   000   000  000   000  000 0 000  0000  000
        //    000 00 00  000   000  000  000       0000000    000   000  000   000  000000000  000 0 000
        //    000 0000   000   000  000  000       000  000   000   000  000   000  000   000  000  0000
        //     00000 00   0000000   000   0000000  000   000  0000000     0000000   00     00  000   000

        public getQuickDown(node:TreeNode):TreeNode
        {
            return this.getDown(node);
        }




        //    00000000  000  00000000    0000000  000000000   0000000  000  0000000    000      000  000   000   0000000
        //    000       000  000   000  000          000     000       000  000   000  000      000  0000  000  000
        //    000000    000  0000000    0000000      000     0000000   000  0000000    000      000  000 0 000  000  0000
        //    000       000  000   000       000     000          000  000  000   000  000      000  000  0000  000   000
        //    000       000  000   000  0000000      000     0000000   000  0000000    0000000  000  000   000   0000000

        public firstSibling(node:TreeNode):TreeNode
        {
            return null;
        }




        //    000       0000000    0000000  000000000   0000000  000  0000000    000      000  000   000   0000000
        //    000      000   000  000          000     000       000  000   000  000      000  0000  000  000
        //    000      000000000  0000000      000     0000000   000  0000000    000      000  000 0 000  000  0000
        //    000      000   000       000     000          000  000  000   000  000      000  000  0000  000   000
        //    0000000  000   000  0000000      000     0000000   000  0000000    0000000  000  000   000   0000000

        public lastSibling(node:TreeNode):TreeNode
        {
            return null;
        }




        //    00000000   00000000   00000000  000   000   0000000  000  0000000    000      000  000   000   0000000
        //    000   000  000   000  000       000   000  000       000  000   000  000      000  0000  000  000
        //    00000000   0000000    0000000    000 000   0000000   000  0000000    000      000  000 0 000  000  0000
        //    000        000   000  000          000          000  000  000   000  000      000  000  0000  000   000
        //    000        000   000  00000000      0      0000000   000  0000000    0000000  000  000   000   0000000

        public previousSibling(node:TreeNode):TreeNode
        {
            var owner:TreeNode = node.owner,
                children:TreeNode[] = owner ? owner.children : null,
                index:number        = children ? children.indexOf(owner) : -1;

            if(index > 0)
                return children[index - 1];
            return null;
        }




        //    000   000  00000000  000   000  000000000   0000000  000  0000000    000      000  000   000   0000000
        //    0000  000  000        000 000      000     000       000  000   000  000      000  0000  000  000
        //    000 0 000  0000000     00000       000     0000000   000  0000000    000      000  000 0 000  000  0000
        //    000  0000  000        000 000      000          000  000  000   000  000      000  000  0000  000   000
        //    000   000  00000000  000   000     000     0000000   000  0000000    0000000  000  000   000   0000000

        public nextSibling(node:TreeNode):TreeNode
        {
            var owner:TreeNode = node.owner,
                children:TreeNode[] = owner ? owner.children : null,
                length:number       = children ? children.length : 0,
                index:number        = children ? children.indexOf(owner) : -1;

            if(index > -1 && index < length - 1)
                return children[index + 1];
            return null;
        }




        //     0000000  000      00000000   0000000   00000000    0000000   000      000
        //    000       000      000       000   000  000   000  000   000  000      000
        //    000       000      0000000   000000000  0000000    000000000  000      000
        //    000       000      000       000   000  000   000  000   000  000      000
        //     0000000  0000000  00000000  000   000  000   000  000   000  0000000  0000000

        public clearAll():void
        {
            this.list.splice(0, this.list.length);
            this.clearNode(this.root);
            this.treeView.drawLater();
        }




        //     0000000  000      00000000   0000000   00000000   000   000   0000000   0000000    00000000
        //    000       000      000       000   000  000   000  0000  000  000   000  000   000  000
        //    000       000      0000000   000000000  0000000    000 0 000  000   000  000   000  0000000
        //    000       000      000       000   000  000   000  000  0000  000   000  000   000  000
        //     0000000  0000000  00000000  000   000  000   000  000   000   0000000   0000000    00000000

        public clearNode(node:TreeNode):void
        {
            var children:TreeNode[] = node.children,
                l:number            = children ? children.length : 0,
                i:number,
                child:TreeNode;

            for(i = 0; i < l; ++i)
            {
                child = children[i];
                this.clearNode(child);
            }

            l ? node.children.splice(0, l) : null;
            node.parsed = false;

            if(node != this.root)
            {
                node.name     = null;
                node.type     = null;
                node.owner    = null;
                node.depth    = NaN;
                node.selected = false;
                node.expanded = false;
                node.value    = null;
                node.index    = -1;
                this.cache.push(node);
            }
        }




        //    0000000    000   0000000  00000000    0000000    0000000  00000000
        //    000   000  000  000       000   000  000   000  000       000
        //    000   000  000  0000000   00000000   000   000  0000000   0000000
        //    000   000  000       000  000        000   000       000  000
        //    0000000    000  0000000   000         0000000   0000000   00000000

        public dispose():void
        {
            this.clearAll();
            var root:TreeNode = this.root;
            this.root         = null;
            this.clearNode(root);
            this.treeView.drawLater();
        }




        //    000   000  00000000   0000000     0000000   000000000  00000000
        //    000   000  000   000  000   000  000   000     000     000
        //    000   000  00000000   000   000  000000000     000     0000000
        //    000   000  000        000   000  000   000     000     000
        //     0000000   000        0000000    000   000     000     00000000

        public update():void
        {
            this.clearAll()
            if(this.showRoot)
            {
                this.list.push(this.root);
                this.root.index = 0;
            }
            else
            {
                this.root.index = -1;
            }

            this.expand(this.root, false);
        }
    }
}
