/// <reference path="../../bower/minto/libs/jsdictionary/jsdictionary.d.ts" />
/// <reference path="../../bower/minto/libs/minto/minto_core.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var elm;
(function (elm) {
    var Abelm = (function (_super) {
        __extends(Abelm, _super);
        function Abelm(id, data, view) {
            _super.call(this, id);
            console.log("Abelm constructor");
            this.view = view;
            this.startup(data);
        }
        Abelm.prototype.startup = function (data) {
            console.log("Abelm startup:");
            var a = [], i, l;
            for (i = 0; i < 5; ++i) {
                a.push(data);
            }
            var treeView = new elm.TreeView(this);
            treeView.flattener.setRoot(data);
            console.log("TOTAL NODES: " + treeView.flattener.list.length);
            console.log("TreeFlattener.setRoot: " + treeView.flattener.list.length + ", " + (treeView.flattener.list.length * (treeView.rowHeight + treeView.rowGap)));
            this.view.appendChild(treeView.getView());
            setTimeout(function () { treeView.draw(); }, 1);
            console.log("it works: ;-) ", treeView.flattener.root);
        };
        return Abelm;
    })(minto.Context);
    elm.Abelm = Abelm;
})(elm || (elm = {}));
var elm;
(function (elm) {
    var Rect = (function () {
        function Rect(x, y, width, height) {
            if (isNaN(x))
                return;
            this.set(x, y, width, height);
        }
        Rect.prototype.set = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.updateBounds();
        };
        Rect.prototype.updateBounds = function () {
            this.left = this.x;
            this.right = this.x + this.width;
            this.top = this.y;
            this.bottom = this.y + this.height;
        };
        Rect.prototype.hitTest = function (x, y) {
            return x >= this.left && x <= this.right
                && y >= this.top && y <= this.bottom;
        };
        Rect.prototype.intersection = function (other) {
            var l = this.left > other.left ? this.left : other.left;
            var r = this.right < other.right ? this.right : other.right;
            var t = this.top > other.top ? this.top : other.top;
            var b = this.bottom < other.bottom ? this.bottom : other.bottom;
            if (l > r || t > b)
                return 0;
            return (r - l) * (b - t);
        };
        Rect.prototype.intersectionPersent = function (other) {
            return this.intersection(other) / (this.width * this.height);
        };
        return Rect;
    })();
    elm.Rect = Rect;
    function getBounds(view, rect) {
        var elemRect = view.getBoundingClientRect(), bodyRect = document.body.getBoundingClientRect(), offsetLeft = elemRect.left - bodyRect.left, offsetTop = elemRect.top - bodyRect.top, offsetWidth = elemRect.width, offsetHeight = elemRect.height;
        if (!rect)
            rect = new Rect(offsetLeft, offsetTop, offsetWidth, offsetHeight);
        else
            rect.set(offsetLeft, offsetTop, offsetWidth, offsetHeight);
        return rect;
    }
    elm.getBounds = getBounds;
})(elm || (elm = {}));
var elm;
(function (elm) {
    var TreeNode = (function () {
        function TreeNode() {
        }
        return TreeNode;
    })();
    elm.TreeNode = TreeNode;
    var TreeFlattener = (function () {
        function TreeFlattener(treeView) {
            this.treeView = treeView;
            this.showRoot = false;
            this.list = [];
            this.cache = [];
        }
        TreeFlattener.prototype.setRoot = function (root) {
            if (this.root && this.root.value != root)
                this.dispose();
            if (!this.root)
                this.root = this.getNode(null, "root", root);
            this.update();
        };
        TreeFlattener.prototype.expand = function (node, recursive) {
            if (this.working)
                return;
            this.working = true;
            if (!node.parsed)
                this.parseNode(node);
            var index = this.list.indexOf(node);
            if (index == -1 && (node != this.root || node == null))
                return;
            var list = [];
            var startIndex = index + 1;
            this.addChildren(node, recursive, list);
            list.unshift(0);
            list.unshift(startIndex);
            this.list.splice.apply(this.list, list);
            this.working = false;
        };
        TreeFlattener.prototype.collapse = function (node, recursive) {
            if (this.working)
                return;
            this.working = true;
            if (!node.parsed)
                this.parseNode(node);
            var index = this.list.indexOf(node);
            if (index == -1 && (node != this.root || node == null))
                return;
            var count = this.removeChildren(node, recursive, true, 0);
            var index = node.children && node.children.length ? this.list.indexOf(node.children[0]) : -1;
            if (index > -1)
                this.list.splice(index, count);
            this.working = false;
        };
        TreeFlattener.prototype.expandAll = function () {
            if (!this.root.parsed)
                this.parseNode(this.root);
            if (this.showRoot) {
                this.expand(this.root, true);
                return;
            }
            var children = this.root.children;
            var l = children ? children.length : 0;
            var i;
            for (i = 0; i < l; ++i)
                this.expand(children[i], true);
        };
        TreeFlattener.prototype.collapseAll = function () {
            if (!this.root.parsed)
                this.parseNode(this.root);
            if (this.showRoot) {
                this.collapse(this.root, true);
                return;
            }
            var children = this.root.children, l = children ? children.length : 0, i;
            for (i = 0; i < l; ++i)
                this.collapse(children[i], true);
        };
        TreeFlattener.prototype.addChildren = function (node, recursive, list) {
            if (!node.parsed)
                this.parseNode(node);
            node.expanded = true;
            var children = node.children, l = children ? children.length : 0, i, child;
            for (i = 0; i < l; ++i) {
                child = children[i];
                list.push(child);
                if (recursive || child.expanded)
                    this.addChildren(child, recursive, list);
            }
        };
        TreeFlattener.prototype.removeChildren = function (node, recursive, removeFromExpanded, count) {
            if (!node.parsed)
                this.parseNode(node);
            var startCount = count;
            var children = node.children, l = children ? children.length : 0, i, index, child;
            for (i = 0; i < l && node.expanded; ++i) {
                child = children[i];
                if (recursive || child.expanded)
                    count += this.removeChildren(child, recursive, recursive, 0);
            }
            if (l && node.expanded)
                count += l;
            if (removeFromExpanded)
                node.expanded = false;
            return count;
        };
        TreeFlattener.prototype.getNode = function (owner, name, value) {
            var node = this.cache.pop() || new TreeNode();
            node.parsed = false;
            node.selected = false;
            node.expanded = false;
            node.name = name;
            node.value = value;
            node.owner = owner;
            node.depth = owner ? owner.depth + 1 : 0;
            if (value.constructor.name == "Array")
                node.type = "array";
            else if (value.constructor.name == "Object")
                node.type = "object";
            else
                node.type = "value";
            return node;
        };
        TreeFlattener.prototype.parseNode = function (node) {
            var value = node.value, children, lst, l, i, obj, key;
            if (node.type == "array") {
                node.type = "array";
                if (!node.children)
                    node.children = [];
                children = node.children;
                lst = value;
                l = lst.length;
                for (i = 0; i < l; ++i)
                    children.push(this.getNode(node, i + "", lst[i]));
            }
            else if (node.type == "object") {
                node.type = "object";
                if (!node.children)
                    node.children = [];
                children = node.children;
                obj = value;
                for (key in obj)
                    children.push(this.getNode(node, key, obj[key]));
            }
            node.parsed = true;
        };
        TreeFlattener.prototype.clearAll = function () {
            var node;
            while (this.list.length)
                this.list.pop();
            this.clearNode(this.root);
        };
        TreeFlattener.prototype.clearNode = function (node) {
            var children = node.children, child;
            while (children && children.length) {
                child = children.pop();
                this.clearNode(child);
            }
            if (node != this.root) {
                node.selected = false;
                node.expanded = false;
                node.parsed = false;
                node.value = null;
                node.owner = null;
                node.depth = NaN;
                if (this.cache.indexOf(node) == -1)
                    this.cache.push(node);
            }
        };
        TreeFlattener.prototype.update = function () {
            this.clearAll();
            if (this.showRoot)
                this.list.push(this.root);
            this.expand(this.root, false);
        };
        TreeFlattener.prototype.dispose = function () {
            this.root = null;
            this.clearAll();
        };
        return TreeFlattener;
    })();
    elm.TreeFlattener = TreeFlattener;
})(elm || (elm = {}));
var elm;
(function (elm) {
    var TreeRenderer = (function () {
        function TreeRenderer(treeView) {
            this.treeView = treeView;
            this.view = document.createElement("div");
            this.view.className = "tree-renderer";
            this.iconView = document.createElement("span");
            this.iconView.className = "elm-tree-renderer-icon";
            this.labelView = document.createElement("span");
            this.labelView.className = "elm-tree-renderer-label";
            this.valueView = document.createElement("span");
            this.valueView.className = "elm-tree-renderer-value";
            this.view.appendChild(this.iconView);
            this.view.appendChild(this.labelView);
            this.view.appendChild(this.valueView);
            this.eventMap = new minto.EventMap();
            this.eventMap.mapEvent(this.view, "click", this.clickHandler, this);
        }
        TreeRenderer.prototype.setData = function (node) {
            this.node = node;
            this.updateLabel();
        };
        TreeRenderer.prototype.updateLabel = function () {
            var node = this.node;
            var isValue = node.type == "value";
            var depth = this.treeView.flattener.showRoot ? node.depth : node.depth - 1;
            this.iconView.textContent = isValue ? "" : node.expanded ? "▼" : "▶";
            ;
            this.labelView.textContent = node.name + ":";
            this.valueView.textContent = isValue ? node.value : "";
            this.iconView.style.marginLeft = (depth * 25) + "px";
        };
        TreeRenderer.prototype.clickHandler = function (event) {
            if (this.node.expanded)
                this.treeView.flattener.collapse(this.node, event.metaKey);
            else
                this.treeView.flattener.expand(this.node, event.metaKey);
            this.treeView.draw();
        };
        return TreeRenderer;
    })();
    elm.TreeRenderer = TreeRenderer;
})(elm || (elm = {}));
var elm;
(function (elm) {
    var TreeView = (function (_super) {
        __extends(TreeView, _super);
        function TreeView(abelm) {
            _super.call(this, abelm);
            this.flattener = new elm.TreeFlattener(this);
            this.eventMap = new minto.EventMap();
            this.renderers = [];
            this.cache = [];
            this.rowHeight = 20;
            this.rowGap = 2;
        }
        TreeView.prototype.getView = function () {
            var _this = this;
            if (!this.view) {
                this.view = document.createElement("div");
                this.view.style.position = "absolute";
                this.view.style.width = "100%";
                this.view.style.height = "100%";
                this.view.style.overflow = "auto";
                this.contentView = document.createElement("div");
                this.contentView.style.position = "absolute";
                this.contentView.style.height = 0 + "px";
                this.contentView.style.width = 100 + "%";
                this.view.appendChild(this.contentView);
                this.eventMap.mapEvent(this.view, "scroll", function (event) { _this.draw(); });
                this.eventMap.mapEvent(window, "resize", function (event) { _this.draw(); });
            }
            return this.view;
        };
        TreeView.prototype.draw = function () {
            var contentView = this.contentView, list = this.flattener.list, l = list.length, vb = elm.getBounds(this.view), cb = elm.getBounds(this.contentView), bb = elm.getBounds(document.body), rh = this.rowHeight, rg = this.rowGap, rgh = rh + rg, th = rgh * l - rg, vh = bb.height, ch = cb.height, cy = vb.y - cb.y, startIndex = Math.floor(cy / rgh), endIndex = Math.min(Math.floor((cy + vh) / rgh), l - 1), renderers = [], cache = this.renderers, renderer, node, i, y;
            for (i = startIndex; i <= endIndex; ++i) {
                y = i * rgh;
                node = list[i];
                renderer = cache.shift();
                if (!renderer) {
                    renderer = this.cache.pop() || new elm.TreeRenderer(this);
                    contentView.appendChild(renderer.view);
                }
                renderer.setData(node);
                renderer.view.style.top = y + "px";
                renderers.push(renderer);
            }
            while (cache.length) {
                renderer = cache.pop();
                contentView.removeChild(renderer.view);
                this.cache.push(renderer);
            }
            this.renderers = renderers;
            if (ch != th)
                this.contentView.style.height = th + "px";
        };
        return TreeView;
    })(minto.Actor);
    elm.TreeView = TreeView;
})(elm || (elm = {}));
/// <reference path="external.ts" />
/// <reference path="Abelm.ts" />
/// <reference path="draggable.d.ts" />
/// <reference path="model/VO.ts" />
/// <reference path="utils/utils.ts" />
/// <reference path="view/TreeFlattener.ts" />
/// <reference path="view/TreeRenderer.ts" />
/// <reference path="view/TreeView.ts" />
