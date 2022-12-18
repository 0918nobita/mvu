/** メッセージを投げる */
export type Dispatch<Msg> = (msg: Msg) => void;

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
export class Cmd<Msg> {
    #effects: Array<Effect<Msg>>;

    constructor(...effects: Array<Effect<Msg>>) {
        this.#effects = effects;
    }

    /** 何もしないコマンド */
    public static readonly none = new Cmd<never>();

    /** コマンド中のメッセージを変換する */
    public static map<MsgA, MsgB>(
        cmd: Cmd<MsgA>,
        f: (msgA: MsgA) => MsgB
    ): Cmd<MsgB> {
        const effects = cmd.#effects.map(
            (effect): Effect<MsgB> =>
                (dispatchB) => {
                    const dispatchA = (msgA: MsgA) => dispatchB(f(msgA));
                    effect(dispatchA);
                }
        );
        return new Cmd(...effects);
    }

    /** コマンドを結合する */
    public static batch<Msg>(...cmds: Array<Cmd<Msg>>): Cmd<Msg> {
        const effects = cmds.flatMap((cmd) => cmd.#effects);
        return new Cmd(...effects);
    }
}
