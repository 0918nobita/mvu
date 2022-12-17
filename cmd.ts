/** メッセージを投げる */
export type Dispatch<Msg> = (msg: Msg) => void;

/**
 * 副作用
 *
 * 途中でメッセージを投げるかもしれない処理
 */
export type Effect<Msg> = (dispatch: Dispatch<Msg>) => void;

/**
 * コマンド
 *
 * メッセージを投げるかもしれない副作用をまとめたコンテナ
 */
export type Cmd<Msg> = Array<Effect<Msg>>;

/** 何もしないコマンド */
export const none: Cmd<never> = [];

/** ひとつの副作用を実行するコマンドを作る */
export const ofEffect = <Msg>(effect: Effect<Msg>): Cmd<Msg> => [effect];

/** コマンド中のメッセージを変換する */
export const map = <MsgA, MsgB>(
    cmd: Cmd<MsgA>,
    f: (msgA: MsgA) => MsgB
): Cmd<MsgB> =>
    cmd.map(
        (effect): Effect<MsgB> =>
            (dispatchB) => {
                const dispatchA = (msgA: MsgA) => dispatchB(f(msgA));
                effect(dispatchA);
            }
    );

/** コマンドを結合する */
export const batch = <Msg>(...cmds: Array<Cmd<Msg>>): Cmd<Msg> => cmds.flat();
