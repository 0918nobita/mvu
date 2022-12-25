import { Renderer } from "@0918nobita-mvu/renderer";

import * as Linked from "./linked-vnode";
import { renderers } from "./renderers-impl";
import { update } from "./update";
import { VNode } from "./vnode";

export const createRenderer = <Msg>(
    parentElement: HTMLElement
): Renderer<VNode<Msg>, Msg> => {
    let currentVNode: Linked.VNode = {
        type: "fragment",
        children: [],
    };

    const renderer: Renderer<VNode<Msg>, Msg> = (vnode, dispatch) => {
        const updated = update({
            renderers,
            oldVNode: currentVNode,
            newVNode: vnode,
            parentElement,
            dispatch,
        });

        currentVNode = updated;
    };

    return renderer;
};
