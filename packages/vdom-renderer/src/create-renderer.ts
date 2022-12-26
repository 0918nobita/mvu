import { Dispatch, Renderer } from "@0918nobita-mvu/renderer";

import * as Linked from "./linked-vnode";
import { renderers } from "./renderers-impl";
import { update } from "./update";
import { VNode } from "./vnode";

type RenderRequest<Msg> = {
    vnode: VNode<Msg>;
    dispatch: Dispatch<Msg>;
};

/**
 * 常に単一の更新処理を行う VDOM レンダラ
 *
 * 処理中に更新を要求された場合、その処理が終了した後に最新の要求のみを処理する
 */
class SingleRenderer<Msg> {
    #currentVNode: Linked.VNode<Msg> = {
        type: "fragment",
        children: [],
    };

    #running = false;

    #latestRequest: RenderRequest<Msg> | null = null;

    #root: HTMLElement;

    constructor(root: HTMLElement) {
        this.#root = root;
    }

    async requestRender(vnode: VNode<Msg>, dispatch: Dispatch<Msg>) {
        if (this.#running) {
            this.#latestRequest = { vnode, dispatch };
            return;
        }

        this.#running = true;

        const updated = update({
            renderers,
            oldVNode: this.#currentVNode,
            newVNode: vnode,
            parentElement: this.#root,
            dispatch,
        });

        this.#currentVNode = updated;

        this.#running = false;

        if (this.#latestRequest !== null) {
            void this.requestRender(
                this.#latestRequest.vnode,
                this.#latestRequest.dispatch
            );

            this.#latestRequest = null;
        }
    }
}

export const createRenderer = <Msg>(
    parentElement: HTMLElement
): Renderer<VNode<Msg>, Msg> => {
    const singleRenderer = new SingleRenderer<Msg>(parentElement);

    return (vnode, dispatch) => {
        void singleRenderer.requestRender(vnode, dispatch);
    };
};
