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
declare class VisibleChildrenObserver {
    private _callback;
    private _contextMap;
    constructor(_callback?: ((target: HTMLElement) => any) | undefined);
    observe(target: HTMLElement): void;
    getVisibleChildren(target: HTMLElement): Element[];
    unobserve(target: HTMLElement): void;
    disconnect(): void;
}
