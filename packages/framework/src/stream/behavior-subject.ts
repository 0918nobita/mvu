import { Subscriber } from "./subscriber";
import { Subscription } from "./subscription";

export class BehaviorSubject<Item> {
    #value: Item;
    #subscribers: Array<Subscriber<Item>> = [];

    constructor(initialValue: Item) {
        this.#value = initialValue;
    }

    public getValue(): Item {
        return this.#value;
    }

    public subscribe(subscriber: Subscriber<Item>): Subscription {
        this.#subscribers.push(subscriber);

        subscriber.next(this.#value);

        return {
            unsubscribe: () => {
                this.#subscribers = this.#subscribers.filter(
                    (s) => s !== subscriber
                );
            },
        };
    }

    public next(item: Item) {
        this.#value = item;

        for (const subscriber of this.#subscribers) {
            subscriber.next(item);
        }
    }
}
