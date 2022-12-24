import { Dispatch } from "@0918nobita-mvu/renderer";

/**
 * 副作用
 *
 * メッセージを投げるかもしれない、すぐに return する処理
 */
export type Effect<Msg> = (dispatch: Dispatch<Msg>) => void;

/**
 * コマンド
 *
 * メッセージを投げるかもしれない副作用をまとめたコンテナ
 */
export type Cmd<Msg> = Set<Effect<Msg>>;

interface CmdMod {
    /** 何もしないコマンド */
    none: Cmd<never>;

    /** 単一の副作用からコマンドを生成する */
    ofEffect: <Msg>(effect: Effect<Msg>) => Cmd<Msg>;

    /** コマンドを実行する */
    run: <Msg>(cmd: Cmd<Msg>, dispatch: Dispatch<Msg>) => void;
}

export const Cmd: CmdMod = {
    none: new Set(),

    ofEffect: (effect) => new Set([effect]),

    run: (cmd, dispatch) => {
        for (const effect of cmd) {
            effect(dispatch);
        }
    },
};
