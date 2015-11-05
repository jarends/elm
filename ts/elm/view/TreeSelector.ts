module elm
{
    export class TreeSelector
    {
        public treeView:TreeView;
        public selectedNodes:TreeNode[];
        public selectedNode:TreeNode;




        constructor(treeView:TreeView)
        {
            this.treeView      = treeView;
            this.selectedNodes = [];
        }




        public select(node:TreeNode):void
        {
            if(node == this.selectedNode)
                return;

            if(this.selectedNode)
                this.selectedNode.selected = false;

            this.selectedNode = node;
            node.selected     = true;
            this.treeView.draw();
        }
    }
}
