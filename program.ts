import { Cmd, Dispatch } from "./cmd";
import { Sub } from "./sub";

/** dispatch ループを生成・実行する */
export interface Program<Arg, Model, Msg, View> {
    init: (arg: Arg) => [Model, Cmd<Msg>];

    update: (msg: Msg, model: Model) => [Model, Cmd<Msg>];

    subscriptions: (model: Model) => Sub<Msg>;

    view: (model: Model, dispatch: Dispatch<Msg>) => View;
}
