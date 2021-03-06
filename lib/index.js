(function (global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
    else {
        global.VisibleChildrenObserver = global.VisibleChildrenObserver || {};
        var exports = global.VisibleChildrenObserver;
        factory(global.require, exports);
    }
})(this, function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const contextMap = new WeakMap();
    function observe(target, callback) {
        if (contextMap.has(target)) {
            return;
        }
        const visibleChlidren = new Set();
        const intersectionObserver = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    visibleChlidren.add(entry.target);
                }
                else {
                    visibleChlidren.delete(entry.target);
                }
            }
            callback && callback(target);
        }, { root: target });
        const mutationObserver = new MutationObserver(records => {
            for (const record of records) {
                for (const addedNode of Array.from(record.addedNodes)) {
                    if (addedNode instanceof Element) {
                        intersectionObserver.observe(addedNode);
                    }
                }
                for (const removedNode of Array.from(record.removedNodes)) {
                    if (removedNode instanceof Element) {
                        intersectionObserver.unobserve(removedNode);
                        if (visibleChlidren.delete(removedNode)) {
                            callback && callback(target);
                        }
                    }
                }
            }
        });
        for (const child of Array.from(target.children)) {
            intersectionObserver.observe(child);
        }
        mutationObserver.observe(target, {
            childList: true
        });
        contextMap.set(target, {
            intersectionObserver,
            mutationObserver,
            visibleChlidren
        });
    }
    exports.observe = observe;
    function getVisibleChildren(target) {
        const context = contextMap.get(target);
        if (!context) {
            throw new Error("Not being observed");
        }
        return [...context.visibleChlidren];
    }
    exports.getVisibleChildren = getVisibleChildren;
    function unobserve(target) {
        const context = contextMap.get(target);
        if (!context) {
            return;
        }
        context.mutationObserver.disconnect();
        context.intersectionObserver.disconnect();
        contextMap.delete(target);
    }
    exports.unobserve = unobserve;
});
//# sourceMappingURL=index.js.map