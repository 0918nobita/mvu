import { Cmd, Dispatch } from "./cmd.ts";
import { Disposable } from "./disposable.ts";
import { BehaviorSubject, Subject } from "./stream/mod.ts";
import { Sub, TaskID } from "./sub.ts";

export interface Program<Arg, Model, Msg, View> {
    /** 引数をもとに、プログラムの初期状態 (モデル、実行するコマンド) を求める */
    init: (arg: Arg) => [Model, Cmd<Msg>];

    /** dispatch されたメッセージと現在のモデルをもとにして、モデルを更新しコマンドを生成する */
    update: (msg: Msg, model: Model) => [Model, Cmd<Msg>];

    /** モデルをもとにして、サブスクリプションを生成する */
    subscriptions: (model: Model) => Sub<Msg>;

    /** モデルをもとにして、ビューを生成する */
    view: (model: Model, dispatch: Dispatch<Msg>) => View;
}

/** dispatch ループを実行する */
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
