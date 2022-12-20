import { Cmd, Dispatch } from "./cmd.ts";
import { BehaviorSubject, Subject } from "./stream/mod.ts";

interface Disposable {
    dispose: () => void;
}

export type Sub<Msg> = (dispatch: Dispatch<Msg>) => Disposable;

type SubID = symbol;

type SubIDs = Set<SubID>;

export type Subs<Msg> = Map<SubID, Sub<Msg>>;

interface Plan {
    toStart: Set<symbol>;
    toDispose: Set<symbol>;
}

interface SubIDsMod {
    readonly diff: (subIDsA: SubIDs, subIDsB: SubIDs) => Plan;
}

export const SubIDs: SubIDsMod = {
    diff: (subIDsA, subIDsB) => {
        const toStart = new Set<SubID>();
        const toDispose = new Set<SubID>();

        for (const subID of subIDsB) {
            if (!subIDsA.has(subID)) {
                toStart.add(subID);
            }
        }

        for (const subID of subIDsA) {
            if (!subIDsB.has(subID)) {
                toDispose.add(subID);
            }
        }

        return { toStart, toDispose };
    },
};

interface SubsMod {
    readonly empty: <Msg>() => Subs<Msg>;

    readonly extractIDs: (subs: Subs<unknown>) => SubIDs;
}

export const Subs: SubsMod = {
    empty: () => new Map(),

    extractIDs: (subs) => new Set(subs.keys()),
};

/** dispatch ループを生成・実行する */
export interface Program<Arg, Model, Msg, View> {
    init: (arg: Arg) => [Model, Cmd<Msg>];

    update: (msg: Msg, model: Model) => [Model, Cmd<Msg>];

    subscriptions: (model: Model) => Subs<Msg>;

    view: (model: Model, dispatch: Dispatch<Msg>) => View;
}

export const run = <Arg, Model, Msg, View>(
    program: Program<Arg, Model, Msg, View>,
    arg: Arg
) => {
    const [model, _cmd] = program.init(arg);

    const model$ = new BehaviorSubject<Model>(model);

    const msg$ = new Subject<Msg>();

    let activeSubIDs = new Set<SubID>();

    const disposables = new Map<SubID, Disposable>();

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
            const newSubs = program.subscriptions(model);
            const newSubIDs = Subs.extractIDs(newSubs);

            const plan = SubIDs.diff(activeSubIDs, newSubIDs);

            for (const subID of plan.toDispose) {
                const sub = disposables.get(subID);
                if (!sub)
                    throw new Error("Subscription to dispose was not found");
                sub.dispose();
                disposables.delete(subID);
            }

            for (const subID of plan.toStart) {
                const sub = newSubs.get(subID);
                if (!sub)
                    throw new Error("Subscription to start was not found");
                disposables.set(subID, sub(dispatch));
            }

            activeSubIDs = newSubIDs;

            const renderedView = program.view(model, dispatch);
            console.log(renderedView);
        },
    });
};
