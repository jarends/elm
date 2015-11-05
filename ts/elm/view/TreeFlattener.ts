module elm
{
    export class TreeNode
    {
        public name:string;
        public type:string;
        public owner:TreeNode;
        public depth:number;
        public selected:boolean;
        public expanded:boolean;
        public parsed:boolean;
        public value:any;
        public children:TreeNode[];
    }




    export class TreeFlattener
    {
        public treeView:TreeView;
        public root:TreeNode;
        public showRoot:boolean;
        public list:TreeNode[];
        public cache:TreeNode[];
        public working:boolean;




        constructor(treeView:TreeView)
        {
            this.treeView = treeView;
            this.showRoot = false;
            this.list     = [];
            this.cache    = [];
        }




        public setRoot(root:VO):void
        {
            if(this.root && this.root.value != root)
                this.dispose();

            if(!this.root)
                this.root = this.getNode(null, "root", root);

            this.update();
        }




        public expand(node:TreeNode, recursive?:boolean):void
		{
            if(this.working)
                return;
            this.working = true;

            if(!node.parsed)
                this.parseNode(node);

			var index:number = this.list.indexOf(node);
			if(index == -1 && (node != this.root || node == null))
				return;

            var list:any[] = [],
                startIndex:number = index + 1,
                secondList:any[];

            this.addChildren(node, recursive, list);

            if(list.length)
            {
                secondList = this.list.splice(startIndex, this.list.length - startIndex);
                this.list  = this.list.concat(list);
                this.list  = this.list.concat(secondList);
            }
            this.working = false;
		}




		public collapse(node:TreeNode, recursive?:boolean):void
		{
            if(this.working)
                return;
            this.working = true;

            if(!node.parsed)
                this.parseNode(node);

			var index:number = this.list.indexOf(node);
			if(index == -1 && (node != this.root || node == null))
				return;

		    var count:number = this.removeChildren(node, recursive, true, 0);
            var index:number = node.children && node.children.length ? this.list.indexOf(node.children[0]) : -1;
            if(index > -1)
                this.list.splice(index, count);

            this.working = false;
		}




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




        /*
		public addChildren(node:TreeNode, recursive:boolean, list:TreeNode[]):void
		{
			var startNode:TreeNode = node,
                children:TreeNode[],
                l:number,
			    i:number,
			    owner:TreeNode;

            while(node)
            {
                if(!node.parsed)
                    this.parseNode(node);

                if(node != startNode)
                    list.push(node);
                children = node.children;

                if(children && children.length && (recursive || node.expanded || node == startNode))
                {
                    node.expanded = true;
                    node = children[0];
                }
                else if(node != startNode)
                {
                    owner    = node.owner;
                    children = owner.children;
                    l        = children.length;
                    i        = children.indexOf(node);

                    if(i < l - 1)
                    {
                        node = children[i + 1];
                    }
                    else
                    {
                        if(owner == startNode)
                        {
                            node = null;
                        }
                        else
                        {
                            while((owner) && (owner != startNode))
                            {
                                node     = node.owner
                                owner    = node.owner;
                                children = owner.children;
                                l        = children.length;
                                i        = children.indexOf(node);

                                if(i < l - 1)
                                {
                                    node  = children[i + 1];
                                    owner = null;
                                }
                            }

                            if(owner == startNode)
                                node = null;
                        }
                    }
                }
                else
                {
                    node = null;
                }
            }
		}
        */




        public addChildren(node:TreeNode, recursive:boolean, list:TreeNode[]):void
        {
            if(!node.parsed)
                this.parseNode(node);

            node.expanded = true;

            var children:TreeNode[] = node.children,
                l:number            = children ? children.length : 0,
                i:number,
                child:TreeNode;

            for(i = 0; i < l; ++i)
            {
                child = children[i];
                list.push(child);

                if(recursive || child.expanded)
                    this.addChildren(child, recursive, list);
            }
        }




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
				if(recursive || child.expanded)
					count += this.removeChildren(child, recursive, recursive, 0);
			}

            if(l && node.expanded)
                count += l;

            if(removeFromExpanded)
			    node.expanded = false;

            return count;
		}




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




		public clearAll():void
		{
            this.list.splice(0, this.list.length);
            this.clearNode(this.root);
		}




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
                this.cache.push(node);
            }
        }




        public dispose():void
        {
            this.clearAll();
            var root:TreeNode = this.root;
            this.root         = null;
            this.clearNode(root);
        }




		public update():void
		{
            this.clearAll()
			if(this.showRoot)
				this.list.push(this.root);

			this.expand(this.root, false);
		}
    }
}
