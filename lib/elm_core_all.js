(function(window){(function(window)
{
    var JSDictionary = function()
    {
        this.datas = {};
    }

    JSDictionary.prototype =
    {
        datas:null,

        map:function(key, value)
        {
            this.datas[JSDictionary.getUID(key)] = { key:key, value:value };
        },

        unmap:function(key)
        {
            delete this.datas[JSDictionary.getUID(key)];
        },

        get:function(key)
        {
            var data = this.datas[JSDictionary.getUID(key)];
            if(data) return data.value;
            return null;
        },

        has:function(key)
        {
            var data = this.datas[JSDictionary.getUID(key)];
            return data != null;
        },

        clear:function()
        {
            this.datas = {};
        },

        isEmpty:function()
        {
            var uid;
            for(uid in this.datas) return false;
            return true;
        },

        length:function()
        {
            var uid, i = 0;
            for(uid in this.datas) ++i;
            return i;
        },

        forEach:function(callback)
        {
            var uid, data;
            for(uid in this.datas)
            {
                data = this.datas[uid];
                callback(data.key, data.value);
            }
        }
    }

    JSDictionary.__jsdict_id__ = 1;

    JSDictionary.getUID = function(key)
    {
        if(key === undefined)  return "__undefined__";
        if(key === null)       return "__null__";

        var type = typeof key;

        if(type === "string")  return "__string__"  + key;
        if(type === "number")  return "__number__"  + key;
        if(type === "boolean") return "__boolean__" + key;

        var uid = key.__jsdict_id__;
        if(!uid)
        {
            uid = "__jsdict_id__" + ++JSDictionary.__jsdict_id__;
            if(Object.defineProperty)
            {
                try
                {
                    Object.defineProperty(key, '__jsdict_id__', { value: uid });
                }
                catch(e)
                {
                    key.__jsdict_id__ = uid;
                }
            }
            else
            {
                key.__jsdict_id__ = uid;
            }
        }

        return uid;
    }


    JSDictionary.hasKeys = function(obj)
    {
        for(var key in obj)
            return true;
        return false;
    }

    window.JSDictionary = JSDictionary;

})(window);var minto;
(function (minto) {
    var DQ = (function () {
        function DQ() {
        }
        DQ.replaceTag = function (view, toTag) {
            var outerHTML = view.outerHTML;
            var fromTag = view.tagName;
            outerHTML = outerHTML.replace(new RegExp("^<" + fromTag, "g"), "<" + toTag).replace(new RegExp(fromTag + ">$", "g"), toTag + ">");
            view.outerHTML = outerHTML;
        };

        DQ.forEach = function (parent, callback) {
            var child = parent.firstChild;
            while (child) {
                if (child.nodeType == 1) {
                    callback(child);
                    if (child.children.length)
                        DQ.forEach(child, callback);
                }
                child = child.nextSibling;
            }
        };

        DQ.forId = function (id) {
            if (document.getElementById)
                return document.getElementById(id);

            var result = [];
            DQ.forEach(document.body, function (child) {
                if (child.id == id)
                    result.push(child);
            });

            return result[0];
        };

        DQ.forTag = function (name, root) {
            root = root || document.body;
            name = name.toLowerCase();
            if (root.getElementsByTagName)
                return root.getElementsByTagName(name);

            var result = [];
            DQ.forEach(root, function (child) {
                if (child.nodeName.toLowerCase() == name)
                    result.push(child);
            });

            return result;
        };

        DQ.forClass = function (clazz, root) {
            root = root || document.body;
            if (root.getElementsByClassName)
                return root.getElementsByClassName(clazz);

            var classRegEx = new RegExp("(^" + clazz + " )|( " + clazz + " )|( " + clazz + "$)|(^" + clazz + "$)");
            var result = [];
            DQ.forEach(root, function (child) {
                if (child.className.length && classRegEx.test(child.className))
                    result.push(child);
            });

            return result;
        };

        DQ.forAttr = function (name, root) {
            root = root || document.body;
            if (root.querySelectorAll)
                return root.querySelectorAll("[" + name + "]");

            var result = [];
            DQ.forEach(root, function (child) {
                if (DQ.hasAttr(name, child))
                    result.push(child);
            });

            return result;
        };

        DQ.forAttributes = function (names, root) {
            root = root || document.body;
            if (root.querySelectorAll)
                return root.querySelectorAll("[" + names.join("], [") + "]");

            var result = [], i, l = names.length;
            DQ.forEach(root, function (child) {
                for (i = 0; i < l; ++i) {
                    if (DQ.hasAttr(names[i], child)) {
                        result.push(child);
                        break;
                    }
                }
            });

            return result;
        };

        DQ.addClass = function (view, name) {
            if (!DQ.hasClass(view, name)) {
                if (view.className.length)
                    view.className = view.className + " " + name;
                else
                    view.className = name;
            }
        };

        DQ.removeClass = function (view, name) {
            var classes, index;

            if (DQ.hasClass(view, name)) {
                classes = view.className.split(/\s+/g);
                index = classes.indexOf(name);
                if (index > -1)
                    classes.splice(index, 1);
                view.className = classes.join(" ");
            }
        };

        DQ.hasClass = function (view, name) {
            var classRegEx = new RegExp("(^" + name + " )|( " + name + " )|( " + name + "$)|(^" + name + "$)");
            return classRegEx.test(view.className);
        };

        DQ.getClasses = function (view) {
            var className = view.className;
            if (className && className.length)
                return className.split(/\s+/g);

            return [];
        };

        DQ.forEachClass = function (view, name, callback) {
            var result = DQ.forClass(name, view);
            var i, l = result.length;

            for (i = 0; i < l; ++i)
                callback(i, result[i]);
        };

        DQ.getAttr = function (name, view) {
            if (view.getAttribute)
                return view.getAttribute(name);
            return view[name];
        };

        DQ.setAttr = function (name, value, view) {
            if (view.setAttribute)
                view.setAttribute(name, value);
            else
                view[name] = value;
        };

        DQ.hasAttr = function (name, view) {
            if (view.hasAttribute)
                return view.hasAttribute(name);
            return !!view[name];
        };

        DQ.setSize = function (view, width, height) {
            if (width === null)
                view.style.removeProperty("width");
            else if (!isNaN(width))
                view.style.width = width + "px";

            if (height === null)
                view.style.removeProperty("height");
            else if (!isNaN(height))
                view.style.height = height + "px";
        };

        DQ.setPosition = function (view, x, y) {
            if (x === null)
                view.style.removeProperty("left");
            else if (!isNaN(x))
                view.style.left = x + "px";

            if (y === null)
                view.style.removeProperty("top");
            else if (!isNaN(y))
                view.style.top = y + "px";
        };
        return DQ;
    })();
    minto.DQ = DQ;
})(minto || (minto = {}));
var minto;
(function (minto) {
    var Dispatcher = (function () {
        function Dispatcher() {
            this.listenerMap = {};
        }
        Dispatcher.prototype.add = function (type, handler, owner) {
            var listeners = this.listenerMap[type];
            if (!listeners) {
                listeners = this.listenerMap[type] = [];
            } else {
                var info, i, l = listeners.length;
                for (i = 0; i < l; ++i) {
                    info = listeners[i];
                    if (info.owner === owner && info.handler === handler)
                        return false;
                }
            }

            listeners.push({ owner: owner, handler: handler });
            return true;
        };

        Dispatcher.prototype.remove = function (type, handler, owner) {
            var listeners = this.listenerMap[type];
            if (!listeners)
                return false;

            var info, i, l = listeners.length;
            for (i = 0; i < l; ++i) {
                info = listeners[i];
                if (info.owner === owner && info.handler === handler) {
                    listeners.splice(i, 1);
                    if (listeners.length == 0)
                        delete this.listenerMap[type];
                    return true;
                }
            }
            return false;
        };

        Dispatcher.prototype.removeAll = function (type) {
            var removed = false;
            if (type) {
                var listeners = this.listenerMap[type];
                var info;
                if (listeners) {
                    while (listeners.length) {
                        info = listeners[0];
                        this.remove(type, info.handler, info.owner);
                    }
                    removed = true;
                }
            } else {
                for (type in this.listenerMap) {
                    this.removeAll(type);
                    removed = true;
                }
            }

            return removed;
        };

        Dispatcher.prototype.has = function (type, handler, owner) {
            if (!type) {
                for (type in this.listenerMap)
                    return true;
            }
            var listeners = this.listenerMap[type];
            if (!listeners)
                return false;

            if (!handler)
                return !!listeners;

            var info, i, l = listeners.length;
            for (i = 0; i < l; ++i) {
                info = listeners[i];
                if (!owner && info.handler === handler)
                    return true;
                if (info.handler === handler && info.owner === owner)
                    return true;
            }
            return false;
        };

        Dispatcher.prototype.dispatch = function (type) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            var listeners = this.listenerMap[type];

            if (!listeners)
                return;

            args.unshift(type);
            var currentListeners = listeners.concat();
            var info, i, l = currentListeners.length;
            for (i = 0; i < l; ++i) {
                info = currentListeners[i];
                info.handler.apply(info.owner, args);
            }
        };
        return Dispatcher;
    })();
    minto.Dispatcher = Dispatcher;
})(minto || (minto = {}));
var minto;
(function (minto) {
    var ObjectCache = (function () {
        function ObjectCache() {
            this.classMap = new JSDictionary();
            this.reuseCount = 0;
        }
        ObjectCache.prototype.get = function (forClass) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            var cached = this.classMap.get(forClass), object;

            if (!cached)
                return this.instantiate(forClass, args);

            ++this.reuseCount;

            object = cached.pop();
            if (!cached.length)
                this.classMap.unmap(forClass);
            if (args && args.length)
                forClass.apply(object, args);
            return object;
        };

        ObjectCache.prototype.has = function (forClass) {
            return !!this.classMap.get(forClass);
        };

        ObjectCache.prototype.cache = function (object, forClass) {
            var cached = this.classMap.get(forClass);
            if (!cached)
                this.classMap.map(forClass, cached = []);

            cached.push(object);
        };

        ObjectCache.prototype.clearCache = function (forClass, keep) {
            var _this = this;
            if (typeof keep === "undefined") { keep = 0; }
            if (!forClass) {
                this.classMap.forEach(function (clazz) {
                    _this.clearCache(clazz, keep);
                });
            } else {
                var cached = this.classMap.get(forClass);
                if (cached) {
                    while (cached.length > keep)
                        cached.pop();
                    if (!keep)
                        this.classMap.unmap(forClass);
                }
            }
        };

        ObjectCache.prototype.instantiate = function (clazz, args) {
            if (!args || !args.length)
                return new clazz();

            switch (args.length) {
                case 1:
                    return new clazz(args[0]);
                case 2:
                    return new clazz(args[0], args[1]);
                case 3:
                    return new clazz(args[0], args[1], args[2]);
                case 4:
                    return new clazz(args[0], args[1], args[2], args[3]);
                case 5:
                    return new clazz(args[0], args[1], args[2], args[3], args[4]);
                case 6:
                    return new clazz(args[0], args[1], args[2], args[3], args[4], args[5]);
                case 7:
                    return new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
                case 8:
                    return new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
                case 9:
                    return new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
                case 10:
                    return new clazz(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
                default:
                    throw new Error("ObjectMap Error: To many constructor args. Supporting no more than 10!");
            }
        };
        return ObjectCache;
    })();
    minto.ObjectCache = ObjectCache;
})(minto || (minto = {}));
var minto;
(function (minto) {
    var EventMap = (function () {
        function EventMap() {
            this.dispatcherMap = new JSDictionary();
        }
        EventMap.prototype.mapEvent = function (dispatcher, type, handler, owner, useCapture) {
            var listenerMap = this.dispatcherMap.get(dispatcher);
            if (!listenerMap)
                this.dispatcherMap.map(dispatcher, listenerMap = {});

            var listeners = listenerMap[type];
            if (!listeners)
                listeners = listenerMap[type] = [];

            if (dispatcher.addEventListener) {
                if (owner) {
                    var callback = function (event) {
                        handler.apply(owner, [event]);
                    };
                    listeners.push({ dispatcher: dispatcher, owner: owner, handler: handler, useCapture: useCapture, callback: callback });
                    dispatcher.addEventListener(type, callback, useCapture);
                } else {
                    listeners.push({ dispatcher: dispatcher, owner: owner, handler: handler, useCapture: useCapture });
                    dispatcher.addEventListener(type, handler, useCapture);
                }
            } else {
                listeners.push({ dispatcher: dispatcher, owner: owner, handler: handler });
                dispatcher.add(type, handler, owner);
            }
        };

        EventMap.prototype.unmapEvent = function (dispatcher, type, handler, owner, useCapture) {
            var listenerMap = this.dispatcherMap.get(dispatcher);
            if (!listenerMap)
                return;

            var listeners = listenerMap[type];
            if (!listeners)
                return;

            var info, i;
            for (i = 0; i < listeners.length;) {
                info = listeners[i];
                if (info.owner === owner && info.handler === handler && info.useCapture === useCapture) {
                    listeners.splice(i, 1);
                    if (dispatcher.addEventListener) {
                        if (owner)
                            dispatcher.removeEventListener(type, info.callback, useCapture);
                        else
                            dispatcher.removeEventListener(type, handler, useCapture);
                    } else {
                        dispatcher.remove(type, handler, owner);
                    }
                } else {
                    ++i;
                }
            }

            if (listeners.length == 0)
                delete listenerMap[type];

            if (!JSDictionary.hasKeys(listenerMap))
                this.dispatcherMap.unmap(dispatcher);
        };

        EventMap.prototype.unmapEvents = function () {
            var _this = this;
            this.dispatcherMap.forEach(function (dispatcher, listenerMap) {
                var type, listeners, info;
                for (type in listenerMap) {
                    listeners = listenerMap[type];
                    while (info = listeners.shift()) {
                        if (dispatcher.addEventListener) {
                            if (info.owner)
                                dispatcher.removeEventListener(type, info.callback, info.useCapture);
                            else
                                dispatcher.removeEventListener(type, info.handler, info.useCapture);
                        } else {
                            dispatcher.remove(type, info.handler, info.owner);
                        }
                    }
                }
                _this.dispatcherMap.unmap(dispatcher);
            });
        };
        return EventMap;
    })();
    minto.EventMap = EventMap;
})(minto || (minto = {}));
var minto;
(function (minto) {
    var Command = (function () {
        function Command() {
        }
        Command.prototype.execute = function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
        };

        Command.prototype.commandComplete = function () {
            this.context.commandMap.commandComplete(this);
        };
        return Command;
    })();
    minto.Command = Command;
})(minto || (minto = {}));
var minto;
(function (minto) {
    var CommandMap = (function () {
        function CommandMap(context) {
            this.context = context;
            this.objectCache = context.objectCache;
            this.eventMap = {};
            this.detainedMap = [];
        }
        CommandMap.prototype.map = function (type, commandClass, oneShot) {
            if (typeof oneShot === "undefined") { oneShot = false; }
            var info = this.eventMap[type];
            if (info)
                throw new Error("Command " + info.commandClass + " already mapped for event " + type + ". Can't map Command " + commandClass);

            info = {
                commandClass: commandClass,
                oneShot: oneShot
            };

            this.eventMap[type] = info;
            this.context.dispatcher.add(type, this.handleEvent, this);
        };

        CommandMap.prototype.unmap = function (type) {
            var info = this.eventMap[type];
            if (!info)
                return;

            this.context.dispatcher.remove(type, this.handleEvent, this);
            delete this.eventMap[type];
        };

        CommandMap.prototype.get = function (type) {
            var info = this.eventMap[type];
            if (info)
                return info.commandClass;
            return null;
        };

        CommandMap.prototype.detain = function (command) {
            var index = this.detainedMap.indexOf(command);
            if (index > -1)
                return;
            this.detainedMap.push(command);
        };

        CommandMap.prototype.release = function (command) {
            var index = this.detainedMap.indexOf(command);
            if (index > -1)
                this.detainedMap.splice(index, 1);
        };

        CommandMap.prototype.commandComplete = function (command) {
            var type = command.type, info = this.eventMap[type];

            if (!info)
                throw new Error("No Command registered for type \"" + type + "\"");

            this.objectCache.cache(command, info.commandClass);
        };

        CommandMap.prototype.handleEvent = function (type) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            var info = this.eventMap[type];
            if (!info)
                throw new Error("No Command registered for type \"" + type + "\"");

            var command = this.objectCache.get(info.commandClass);
            command.context = this.context;
            command.type = type;

            command.execute.apply(command, args);

            if (info.oneShot === true)
                this.unmap(type);
        };
        return CommandMap;
    })();
    minto.CommandMap = CommandMap;
})(minto || (minto = {}));
var minto;
(function (minto) {
    var Actor = (function () {
        function Actor(context) {
            this.context = context;
            this.dispatcher = context.dispatcher;
        }
        Actor.prototype.dispatch = function (type) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            args.unshift(type);
            return this.dispatcher.dispatch.apply(this.dispatcher, args);
        };
        return Actor;
    })();
    minto.Actor = Actor;
})(minto || (minto = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var minto;
(function (minto) {
    var Mediator = (function (_super) {
        __extends(Mediator, _super);
        function Mediator(context) {
            _super.call(this, context);
        }
        Mediator.prototype.onRegister = function () {
        };

        Mediator.prototype.onRemove = function () {
        };

        Mediator.prototype.getChild = function (className) {
            return minto.DQ.forClass(className, this.view)[0];
        };

        Mediator.prototype.getChildren = function (className) {
            return minto.DQ.forClass(className, this.view);
        };
        return Mediator;
    })(minto.Actor);
    minto.Mediator = Mediator;
})(minto || (minto = {}));
var minto;
(function (minto) {
    var MediatorMap = (function () {
        function MediatorMap(context) {
            this.context = context;
            this.objectCache = context.objectCache;
            this.className = MediatorMap.defaultClassName;
            this.mediatorClassForClass = {};
            this.mediatorsForView = new JSDictionary();
        }
        MediatorMap.prototype.map = function (clazz, mediatorClass) {
            this.mediatorClassForClass[clazz] = mediatorClass;
        };

        MediatorMap.prototype.unmap = function (clazz) {
            delete this.mediatorClassForClass[clazz];
        };

        MediatorMap.prototype.mapView = function (view, includeView) {
            var _this = this;
            if (includeView !== false && minto.DQ.hasClass(view, this.className))
                this.registerMediators(view);

            minto.DQ.forEachClass(view, this.className, function (index, child) {
                _this.registerMediators(child);
            });
        };

        MediatorMap.prototype.unmapView = function (view, includeView) {
            var _this = this;
            if (includeView !== false && minto.DQ.hasClass(view, this.className))
                this.removeMediators(view);

            minto.DQ.forEachClass(view, this.className, function (index, child) {
                _this.removeMediators(child);
            });
        };

        MediatorMap.prototype.registerMediators = function (view) {
            var classNames = minto.DQ.getClasses(view), mediatorForClass = this.mediatorsForView.get(view), l = classNames.length, i, clazz;

            for (i = 0; i < l; ++i) {
                clazz = classNames[i];
                if (!(mediatorForClass && mediatorForClass[clazz]))
                    this.createMediator(view, clazz);
            }
        };

        MediatorMap.prototype.removeMediators = function (view) {
            var mediatorForClass = this.mediatorsForView.get(view);
            if (!mediatorForClass)
                return;

            var clazz, mediator;

            for (clazz in mediatorForClass) {
                mediator = mediatorForClass[clazz];
                mediator.onRemove();
                mediator.view = null;
                this.objectCache.cache(mediator, this.mediatorClassForClass[clazz]);
            }

            this.mediatorsForView.unmap(view);
        };

        MediatorMap.prototype.addClass = function (view, clazz) {
            minto.DQ.addClass(view, clazz);
            this.createMediator(view, clazz);
        };

        MediatorMap.prototype.removeClass = function (view, clazz) {
            minto.DQ.removeClass(view, clazz);
            this.deleteMediator(view, clazz);
        };

        MediatorMap.prototype.addClasses = function (view, classes) {
            var classeNames = classes.split(/\s+/g), l = classeNames.length, i;
            for (i = 0; i < l; ++i)
                this.addClass(view, classeNames[i]);
        };

        MediatorMap.prototype.removeClasses = function (view, classes) {
            var classeNames = classes.split(/\s+/g), l = classeNames.length, i;
            for (i = 0; i < l; ++i)
                this.removeClass(view, classeNames[i]);
        };

        MediatorMap.prototype.createMediator = function (view, clazz) {
            var mediatorClass = this.mediatorClassForClass[clazz];
            if (!mediatorClass)
                return null;

            var mediatorForClass = this.mediatorsForView.get(view);
            if (!mediatorForClass) {
                mediatorForClass = {};
                this.mediatorsForView.map(view, mediatorForClass);
            } else if (mediatorForClass[clazz]) {
                return null;
            }

            var mediator = this.objectCache.get(mediatorClass, this.context);
            mediator.view = view;
            mediator.clazz = clazz;
            mediatorForClass[clazz] = mediator;
            mediator.onRegister();

            return mediator;
        };

        MediatorMap.prototype.deleteMediator = function (view, clazz) {
            var mediatorForClass = this.mediatorsForView.get(view);
            if (!mediatorForClass)
                return;

            var mediator = mediatorForClass[clazz];
            if (!mediator)
                return;

            mediator.onRemove();
            mediator.view = null;

            this.objectCache.cache(mediator, this.mediatorClassForClass[clazz]);
            delete mediatorForClass[clazz];

            for (clazz in mediatorForClass)
                return;

            this.mediatorsForView.unmap(view);
        };
        MediatorMap.defaultClassName = "minto";
        MediatorMap.DQ = minto.DQ;
        return MediatorMap;
    })();
    minto.MediatorMap = MediatorMap;
})(minto || (minto = {}));
var minto;
(function (minto) {
    var Context = (function () {
        function Context(id) {
            this.id = id;
            this.injectionPoints = {};
            this.view = minto.DQ.forId(id);

            this.mapSingleton("dispatcher", new minto.Dispatcher());
            this.mapSingleton("objectCache", new minto.ObjectCache());
            this.mapSingleton("commandMap", new minto.CommandMap(this));
            this.mapSingleton("mediatorMap", new minto.MediatorMap(this));
        }
        Context.prototype.dispatch = function (type) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            args.unshift(type);
            return this.dispatcher.dispatch.apply(this.dispatcher, args);
        };

        Context.prototype.mapSingleton = function (name, singleton, asProperty) {
            if (typeof asProperty === "undefined") { asProperty = true; }
            this.injectionPoints[name] = singleton;
            if (asProperty)
                this[name] = singleton;
        };

        Context.prototype.inject = function (target, named) {
            var injectionPoints = this.injectionPoints, l, i, name;

            if (named) {
                l = named.length;
                for (i = 0; i < l; ++i) {
                    name = named[i];
                    target[name] = injectionPoints[name];
                }
            } else {
                for (name in injectionPoints)
                    target[name] = injectionPoints[name];
            }
        };
        return Context;
    })();
    minto.Context = Context;
})(minto || (minto = {}));
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
            data = { root: a };
            var treeView = new elm.TreeView(this);
            treeView.flattener.setRoot(data);
            treeView.flattener.expandAll();
            this.view.appendChild(treeView.view);
            treeView.draw();
        };
        Abelm.prototype.dispose = function () {
            console.log("Abelm.dispose!!!");
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
            var list = [], startIndex = index + 1, secondList;
            this.addChildren(node, recursive, list);
            if (list.length) {
                secondList = this.list.splice(startIndex, this.list.length - startIndex);
                this.list = this.list.concat(list);
                this.list = this.list.concat(secondList);
            }
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
            var startNode = node;
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
            this.list.splice(0, this.list.length);
            this.clearNode(this.root);
        };
        TreeFlattener.prototype.clearNode = function (node) {
            var children = node.children, l = children ? children.length : 0, i, child;
            for (i = 0; i < l; ++i) {
                child = children[i];
                this.clearNode(child);
            }
            l ? node.children.splice(0, l) : null;
            node.parsed = false;
            if (node != this.root) {
                node.name = null;
                node.type = null;
                node.owner = null;
                node.depth = NaN;
                node.selected = false;
                node.expanded = false;
                node.value = null;
                this.cache.push(node);
            }
        };
        TreeFlattener.prototype.dispose = function () {
            this.clearAll();
            var root = this.root;
            this.root = null;
            this.clearNode(root);
        };
        TreeFlattener.prototype.update = function () {
            this.clearAll();
            if (this.showRoot)
                this.list.push(this.root);
            this.expand(this.root, false);
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
            this.view.className = "elm-tree-renderer";
            this.view.tabIndex = -1;
            this.iconView = document.createElement("span");
            this.iconView.className = "elm-tree-renderer-icon";
            this.labelView = document.createElement("span");
            this.labelView.className = "elm-tree-renderer-label";
            this.valueView = document.createElement("span");
            this.valueView.className = "elm-tree-renderer-value";
            this.view.appendChild(this.iconView);
            this.view.appendChild(this.labelView);
            this.view.appendChild(this.valueView);
            this.view.tabIndex = -1;
            this.eventMap = new minto.EventMap();
            this.eventMap.mapEvent(this.view, "click", this.clickHandler, this);
            this.eventMap.mapEvent(this.view, "mouseover", this.mouseOverHandler, this);
            this.eventMap.mapEvent(this.view, "mouseout", this.mouseOutHandler, this);
            this.eventMap.mapEvent(this.view, "mousedown", this.mouseDownHandler, this);
            this.eventMap.mapEvent(this.view, "mouseup", this.mouseUpHandler, this);
            this.eventMap.mapEvent(this.iconView, "click", this.iconClickHandler, this);
        }
        TreeRenderer.prototype.setData = function (node) {
            this.node = node;
            this.updateData();
        };
        TreeRenderer.prototype.updateData = function () {
            var node = this.node, isValue = node.type == "value", depth = this.treeView.flattener.showRoot ? node.depth : node.depth - 1;
            this.labelView.textContent = node.name + ":";
            this.valueView.textContent = isValue ? node.value : "";
            this.iconView.style.marginLeft = (depth * 20 + 5) + "px";
            if (this.node.selected)
                this.view.classList.add("elm-tree-renderer-selected");
            else
                this.view.classList.remove("elm-tree-renderer-selected");
            if (this.node.expanded)
                this.iconView.classList.add("elm-tree-renderer-expanded");
            else
                this.iconView.classList.remove("elm-tree-renderer-expanded");
            if (isValue)
                this.iconView.classList.add("elm-tree-renderer-no-expand");
            else
                this.iconView.classList.remove("elm-tree-renderer-no-expand");
        };
        TreeRenderer.prototype.iconClickHandler = function (event) {
            if (this.node.expanded)
                this.treeView.flattener.collapse(this.node, event.metaKey);
            else
                this.treeView.flattener.expand(this.node, event.metaKey);
            this.treeView.draw();
            event.stopImmediatePropagation();
        };
        TreeRenderer.prototype.clickHandler = function (event) {
            if (!this.node.selected)
                this.treeView.selector.select(this.node);
        };
        TreeRenderer.prototype.mouseOverHandler = function (event) {
            this.isOver = true;
            this.isDown = false;
            this.updateData();
        };
        TreeRenderer.prototype.mouseOutHandler = function (event) {
            this.isOver = false;
            this.isDown = false;
            this.updateData();
        };
        TreeRenderer.prototype.mouseDownHandler = function (event) {
            this.isOver = true;
            this.isDown = true;
            this.updateData();
        };
        TreeRenderer.prototype.mouseUpHandler = function (event) {
            this.isOver = true;
            this.isDown = false;
            this.updateData();
        };
        return TreeRenderer;
    })();
    elm.TreeRenderer = TreeRenderer;
})(elm || (elm = {}));
var elm;
(function (elm) {
    var TreeSelector = (function () {
        function TreeSelector(treeView) {
            this.treeView = treeView;
            this.selectedNodes = [];
        }
        TreeSelector.prototype.select = function (node) {
            if (node == this.selectedNode)
                return;
            if (this.selectedNode)
                this.selectedNode.selected = false;
            this.selectedNode = node;
            node.selected = true;
            this.treeView.draw();
        };
        return TreeSelector;
    })();
    elm.TreeSelector = TreeSelector;
})(elm || (elm = {}));
var elm;
(function (elm) {
    var TreeView = (function (_super) {
        __extends(TreeView, _super);
        function TreeView(abelm) {
            var _this = this;
            _super.call(this, abelm);
            this.view = document.createElement("div");
            this.contentView = document.createElement("div");
            this.view.tabIndex = -1;
            this.flattener = new elm.TreeFlattener(this);
            this.selector = new elm.TreeSelector(this);
            this.eventMap = new minto.EventMap();
            this.renderers = [];
            this.cache = [];
            this.rowHeight = 20;
            this.rowGap = 2;
            this.contentView.style.height = 0 + "px";
            this.contentView.style.width = 100 + "%";
            this.contentView.classList.add("elm-tree-view-content");
            this.view.classList.add("elm-tree-view");
            this.view.appendChild(this.contentView);
            this.eventMap.mapEvent(this.view, "scroll", function (event) { _this.draw(); });
            this.eventMap.mapEvent(window, "resize", function (event) { _this.draw(); });
        }
        TreeView.prototype.getView = function () {
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
/// <reference path="view/TreeSelector.ts" />
/// <reference path="view/TreeView.ts" />
module.exports = {minto:minto,elm:elm,JSDictionary:JSDictionary}})(window);