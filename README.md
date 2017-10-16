# visible-children-observer

Observes current visible childrens on root element. [Demo](https://saschanaz.github.io/visible-children-observer/)

# API

```ts
declare class VisibleChildrenObserver {
    constructor(_callback?: ((target: HTMLElement) => any) | undefined);
    observe(target: HTMLElement): void;
    getVisibleChildren(target: HTMLElement): Element[];
    unobserve(target: HTMLElement): void;
    disconnect(): void;
}
```
