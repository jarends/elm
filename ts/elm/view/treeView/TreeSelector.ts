module elm
{
    export class TreeSelector
    {
        public treeView:TreeView;
        public selectedNodes:TreeNode[];
        public activeNode:TreeNode;
        public allowDeselect:boolean;



        constructor(treeView:TreeView)
        {
            this.treeView      = treeView;
            this.selectedNodes = [];
            this.allowDeselect = false;
        }




        public setActive(node:TreeNode):void
        {
            this.activeNode = node;
            this.updateView();
        }




        public select(node:TreeNode):void
        {
            if(!node)
            {
                this.deselectAll();
                this.activeNode = null;
                return;
            }

            this.deselectAll();
            node.selected   = true;
            this.activeNode = node;
            this.selectedNodes.push(node);
            this.updateView();
        }




        public selectWithShift(node:TreeNode):void
        {
            if(!node)
            {
                this.deselectAll();
                this.activeNode = null;
                return;
            }

            var active:TreeNode          = this.activeNode,
                list:TreeNode[]          = this.treeView.flattener.list,
                first:TreeNode           = this.selectedNodes[0],
                selectedNodes:TreeNode[] = this.selectedNodes,
                index:number             = node.index,
                activeIndex:number       = active.index,
                l:number,
                i:number,
                child:TreeNode;

            if((active && active.owner != node.owner) || index == -1 || activeIndex == -1)
            {
                this.deselectAll();
                this.select(node);
                return;
            }

            if(first && first.owner != node.owner)
                this.deselectAll();

            if(index < activeIndex)
            {
                i = index;
                l = activeIndex;
            }
            else
            {
                i = activeIndex;
                l = index;
            }

            for(i; i <= l; ++i)
            {
                child = list[i];
                if(selectedNodes.indexOf(child) == -1)
                    selectedNodes.push(child);
                child.selected = true;
            }

            this.activeNode = node;
            this.updateView();
        }




        public selectWithCommand(node:TreeNode, deselectOnly:boolean):void
        {
            if(!node)
            {
                this.deselectAll();
                this.activeNode = null;
                return;
            }

            var nodes:TreeNode[] = this.selectedNodes,
                index:number     = nodes.indexOf(node),
                first:TreeNode   = nodes[0];

            if(index == -1)
            {
                if(first && first.owner != node.owner)
                    this.deselectAll();

                if(!deselectOnly)
                {
                    node.selected = true;
                    nodes.push(node);
                }
            }
            else
            {
                node.selected = false;
                nodes.splice(index, 1);
            }

            if(deselectOnly && this.activeNode)
            {
                this.activeNode.selected = false;
                index = nodes.indexOf(this.activeNode);
                if(index > -1)
                    nodes.splice(index, 1);
            }
            this.activeNode = node;
            this.updateView();
        }


        public selectByKey(node:TreeNode, metaKey:boolean, shiftKey:boolean, deleteOnly:boolean):void
        {
            metaKey  ? this.selectWithCommand(node, deleteOnly) :
            shiftKey ? this.selectWithShift(node) :
            this.select(node);
        }




        public selectNodes(nodes:TreeNode[]):void
        {
            this.updateView();
        }




        public isActive(node:TreeNode):boolean
        {
            return node == this.activeNode;
        }


        public isActiveSelected():boolean
        {
            return this.selectedNodes.indexOf(this.activeNode) > -1;
        }


        public isSelected(node:TreeNode):boolean
        {
            return this.selectedNodes.indexOf(node) > -1;
        }




        public toggle(node:TreeNode):void
        {
            if(!node)
                return;

            var index:number   = this.selectedNodes.indexOf(node),
                first:TreeNode = this.selectedNodes[0];

            if(index > -1)
            {
                this.selectedNodes.splice(index, 1);
                node.selected = false;
            }
            else
            {
                if(first && first.owner != node.owner)
                    this.deselectAll();

                this.selectedNodes.push(node);
                node.selected = true;
            }
            this.activeNode = node;
            this.updateView();
        }


        public toggleActive():void
        {
            this.toggle(this.activeNode);
        }




        public deselect(node:TreeNode):void
        {
            if(!node)
                return;

            var index:number = this.selectedNodes.indexOf(node);
            if(index > -1)
            {
                this.selectedNodes.splice(index, 1);
                node.selected = false;
            }

            this.activeNode = node;
            this.updateView();
        }


        public deselectAll():void
        {
            var nodes:TreeNode[] = this.selectedNodes,
                l:number         = nodes.length,
                i:number,
                node:TreeNode;

            for(i = 0; i < l; ++i)
            {
                node          = nodes[i];
                node.selected = false;
            }

            nodes.splice(0, nodes.length);
            this.updateView();
        }




        public updateView():void
        {
            this.treeView.drawLater();
        }
    }
}
