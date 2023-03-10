import { Dispatch } from "@0918nobita-mvu/renderer";

import { Disposable } from "./disposable";

/** 実行中にメッセージを dispatch できるタスク */
export type TaskWithDispatch<Msg> = (dispatch: Dispatch<Msg>) => Disposable;

export type TaskID = symbol;

export type Sub<Msg> = Map<TaskID, TaskWithDispatch<Msg>>;

type Plan = {
    toStart: Set<TaskID>;
    toDispose: Set<TaskID>;
};

type SubMod = {
    /** 何もしないサブスクリプション */
    none: <Msg>() => Sub<Msg>;

    /** 単一のタスクからサブスクリプションを生成する */
    ofTask: <Msg>(taskID: TaskID, task: TaskWithDispatch<Msg>) => Sub<Msg>;

    /** ２つのサブスクリプションを比較し、どのタスクを開始し、どのタスクを dispose するかを決定する */
    diff: <Msg>(subA: Sub<Msg>, subB: Sub<Msg>) => Plan;
};

export const Sub: SubMod = {
    none: <Msg>(): Sub<Msg> => new Map(),

    ofTask: (taskID, task) => new Map([[taskID, task]]),

    diff: <Msg>(subA: Sub<Msg>, subB: Sub<Msg>): Plan => {
        const toStart = new Set<TaskID>();
        const toDispose = new Set<TaskID>();

        for (const taskID of subB.keys()) {
            if (!subA.has(taskID)) {
                toStart.add(taskID);
            }
        }

        for (const taskID of subA.keys()) {
            if (!subB.has(taskID)) {
                toDispose.add(taskID);
            }
        }

        return { toStart, toDispose };
    },
};
