export type Subscriber<Item> = {
    next: (item: Item) => void;
};
