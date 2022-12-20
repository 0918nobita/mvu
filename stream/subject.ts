import { Subscriber } from "./subscriber.ts";
import { Subscription } from "./subscription.ts";

export class Subject<Item> {
    #subscribers: Array<Subscriber<Item>> = [];

    public subscribe(subscriber: Subscriber<Item>): Subscription {
        this.#subscribers.push(subscriber);
        return {
            unsubscribe: () => {
                this.#subscribers = this.#subscribers.filter(
                    (s) => s !== subscriber
                );
            },
        };
    }

    public next(item: Item) {
        for (const subscriber of this.#subscribers) {
            subscriber.next(item);
        }
    }
}
