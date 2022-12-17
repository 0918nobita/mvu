import { Dispatch } from "./cmd";
import { Disposable } from "./disposable";

/** サブスクリプションの識別子 */
export class SubId {
    #base: string;
    #prefixes: string[] = [];

    constructor(base: string) {
        this.#base = base;
    }

    public static equal(a: SubId, b: SubId): boolean {
        if (a.#base !== b.#base) return false;

        if (a.#prefixes.length !== b.#prefixes.length) return false;

        for (let i = 0; i < a.#prefixes.length; i++) {
            if (a.#prefixes[i] !== b.#prefixes[i]) return false;
        }

        return true;
    }

    public static addPrefix(subId: SubId, prefix: string): SubId {
        const newSubId = new SubId(subId.#base);
        newSubId.#prefixes = [prefix, ...subId.#prefixes];
        return newSubId;
    }
}

/** サブスクリプションを開始して、停止用の Disposable オブジェクトを返す */
export type Subscribe<Msg> = (dispatch: Dispatch<Msg>) => Disposable;

/**
 * サブスクリプション
 *
 * 実行中に新たなメッセージを生成する
 */
export class Sub<Msg> {
    #subscribeFns: ReadonlyArray<[SubId, Subscribe<Msg>]>;

    constructor(subscribeFns: ReadonlyArray<[SubId, Subscribe<Msg>]> = []) {
        this.#subscribeFns = subscribeFns;
    }

    public static add<A, B>(
        sub: Sub<A>,
        subId: SubId,
        subscribeFn: Subscribe<B>
    ): Sub<A | B> {
        return new Sub<A | B>(
            sub.#subscribeFns.map(([otherSubId, otherSubscribeFn]) =>
                SubId.equal(subId, otherSubId)
                    ? [subId, subscribeFn]
                    : [otherSubId, otherSubscribeFn]
            )
        );
    }
}

export const empty = new Sub<never>();
