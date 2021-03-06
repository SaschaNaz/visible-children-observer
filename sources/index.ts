const contextMap = new WeakMap<HTMLElement, {
    intersectionObserver: IntersectionObserver;
    mutationObserver: MutationObserver;
    visibleChlidren: Set<Element>;
}>();

export function observe(target: HTMLElement, callback?: (target: HTMLElement) => any) {
    if (contextMap.has(target)) {
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

export function getVisibleChildren(target: HTMLElement) {
    const context = contextMap.get(target);
    if (!context) {
        throw new Error("Not being observed");
    }
    return [...context.visibleChlidren];
}

export function unobserve(target: HTMLElement) {
    const context = contextMap.get(target);
    if (!context) {
        return;
    }
    context.mutationObserver.disconnect();
    context.intersectionObserver.disconnect();
    contextMap.delete(target);
}
