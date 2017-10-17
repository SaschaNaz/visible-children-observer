interface IntersectionObserverEntry {
    isIntersecting: boolean;
}

interface DOMRect {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
}

class VisibleChildrenObserver {
    private _contextMap = new Map<HTMLElement, {
        intersectionObserver: IntersectionObserver;
        mutationObserver: MutationObserver;
        visibleChlidren: Set<Element>;
    }>();

    constructor(private _callback?: (target: HTMLElement) => any) {

    }

    observe(target: HTMLElement) {
        if (this._contextMap.has(target)) {
            return;
        }
        const visibleChlidren = new Set<Element>();
        const intersectionObserver = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    visibleChlidren.add(entry.target);
                }
                else {
                    visibleChlidren.delete(entry.target);
                }
            }
            this._callback && this._callback(target);
        }, {
            root: target
        });
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
                            this._callback && this._callback(target);
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
        this._contextMap.set(target, {
            intersectionObserver,
            mutationObserver,
            visibleChlidren
        });
    }

    getVisibleChildren(target: HTMLElement) {
        const context = this._contextMap.get(target);
        if (!context) {
            throw new Error("Not being observed");
        }
        return [...context.visibleChlidren];
    }

    unobserve(target: HTMLElement) {
        const context = this._contextMap.get(target);
        if (!context) {
            return;
        }
        context.mutationObserver.disconnect();
        context.intersectionObserver.disconnect();
        this._contextMap.delete(target);
    }

    disconnect() {
        for (const [key, value] of Array.from(this._contextMap)) {
            value.mutationObserver.disconnect();
            value.intersectionObserver.disconnect();
            this._contextMap.delete(key);
        }
    }
}
