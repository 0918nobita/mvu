import { Cmd, Dispatch } from "./cmd.ts";
import { Disposable } from "./disposable.ts";
import { BehaviorSubject, Subject } from "./stream/mod.ts";
import { Sub, TaskID } from "./sub.ts";

/** dispatch ループを生成・実行する */
export interface Program<Arg, Model, Msg, View> {
    init: (arg: Arg) => [Model, Cmd<Msg>];

    update: (msg: Msg, model: Model) => [Model, Cmd<Msg>];

    subscriptions: (model: Model) => Sub<Msg>;

    view: (model: Model, dispatch: Dispatch<Msg>) => View;
}

export const run = <Arg, Model, Msg, View>(
    program: Program<Arg, Model, Msg, View>,
    arg: Arg
) => {
    const [model, _cmd] = program.init(arg);

    const model$ = new BehaviorSubject<Model>(model);

    const msg$ = new Subject<Msg>();

    let activeSub = Sub.none<Msg>();

    const disposables = new Map<TaskID, Disposable>();

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
            const newSub = program.subscriptions(model);

            const plan = Sub.diff(activeSub, newSub);

            for (const subID of plan.toDispose) {
                const sub = disposables.get(subID);
                if (!sub)
                    throw new Error("Subscription to dispose was not found");
                sub.dispose();
                disposables.delete(subID);
            }

            for (const subID of plan.toStart) {
                const sub = newSub.get(subID);
                if (!sub)
                    throw new Error("Subscription to start was not found");
                disposables.set(subID, sub(dispatch));
            }

            activeSub = newSub;

            const renderedView = program.view(model, dispatch);
            console.log(renderedView);
        },
    });
};
