interface IntersectionObserverEntry {
    isIntersecting: boolean;
}

class VisibleChildrenObserver {
    private _contextMap = new Map<HTMLElement, {
        intersectionObserver: IntersectionObserver;
        mutationObserver: MutationObserver;
    }>();

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
            mutationObserver
        });
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