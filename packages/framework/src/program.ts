import { Renderer } from "@0918nobita-mvu/renderer";

import { Cmd, Dispatch } from "./cmd";
import { Disposable } from "./disposable";
import { BehaviorSubject, Subject } from "./stream";
import { Sub, TaskID } from "./sub";

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
    arg: Arg,
    renderer: Renderer<View>
) => {
    const [initialModel, initialCmd] = program.init(arg);

    const model$ = new BehaviorSubject<Model>(initialModel);

    const msg$ = new Subject<Msg>();

    let activeSub = Sub.none<Msg>();

    const tasks = new Map<TaskID, Disposable>();

    const dispatch = (msg: Msg) => {
        msg$.next(msg);
    };

    msg$.subscribe({
        next: (msg) => {
            const [newModel, newCmd] = program.update(msg, model$.getValue());
            Cmd.run(newCmd, dispatch);
            model$.next(newModel);
        },
    });

    model$.subscribe({
        next: (model) => {
            const newSub = program.subscriptions(model);

            const plan = Sub.diff(activeSub, newSub);

            for (const taskID of plan.toDispose) {
                const task = tasks.get(taskID);
                if (!task) throw new Error("Task to dispose was not found");
                task.dispose();
                tasks.delete(taskID);
            }

            for (const taskID of plan.toStart) {
                const task = newSub.get(taskID);
                if (!task) throw new Error("Task to start was not found");
                tasks.set(taskID, task(dispatch));
            }

            activeSub = newSub;

            const view = program.view(model, dispatch);
            renderer(view);
        },
    });

    Cmd.run(initialCmd, dispatch);
};
