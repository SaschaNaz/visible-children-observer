# visible-children-observer

Observes current visible childrens on root element. [Demo](https://saschanaz.github.io/visible-children-observer/)

# API

```ts
export declare function observe(target: HTMLElement, callback?: (target: HTMLElement) => any): void;
export declare function getVisibleChildren(target: HTMLElement): Element[];
export declare function unobserve(target: HTMLElement): void;
export as namespace VisibleChildrenObserver;
```
