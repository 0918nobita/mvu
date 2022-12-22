export interface Subscriber<Item> {
    next: (item: Item) => void;
}
