import * as Linked from "../linked-vnode";
import * as VNode from "../vnode";

export const renderText = (vnodeText: VNode.VText): Linked.VText => {
    const text = document.createTextNode(vnodeText.text);

    return {
        type: "text",
        text: vnodeText.text,
        linkedElement: text,
    };
};
