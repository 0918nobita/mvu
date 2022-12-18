import { Cmd, Dispatch } from "./cmd.ts";
import { Sub } from "./sub.ts";

/** dispatch ループを生成・実行する */
export interface Program<Arg, Model, Msg, View> {
    init: (arg: Arg) => [Model, Cmd<Msg>];

    update: (msg: Msg, model: Model) => [Model, Cmd<Msg>];

    subscriptions: (model: Model) => Sub<Msg>;

    view: (model: Model, dispatch: Dispatch<Msg>) => View;
}

interface Subscriber<Item> {
    next: (item: Item) => void;
}

interface Subscription {
    unsubscribe: () => void;
}

class Subject<Item> {
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

class BehaviorSubject<Item> {
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

export const run = <Arg, Model, Msg, View>(
    program: Program<Arg, Model, Msg, View>,
    arg: Arg
) => {
    const [model, _cmd] = program.init(arg);

    const model$ = new BehaviorSubject<Model>(model);

    const msg$ = new Subject<Msg>();

    const dispatch = (msg: Msg) => {
        msg$.next(msg);
    };

    msg$.subscribe({
        next: (msg) => {
            const updated = program.update(msg, model$.getValue());
            model$.next(updated[0]);
        },
    });

    model$.subscribe({
        next: (model) => {
            const renderedView = program.view(model, dispatch);
            console.log(renderedView);
        },
    });
};
