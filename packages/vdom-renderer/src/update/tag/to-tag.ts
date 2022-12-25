import { Dispatch } from "@0918nobita-mvu/renderer";

import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";
import { Tag } from "../../vnode";
import { UpdateFn } from "../sig";

type UpdateTagToTag<Msg> = {
    oldTag: Linked.Tag;
    newTag: Tag<Msg>;
    renderers: Renderers;
    dispatch: Dispatch<Msg>;
};

export const updateTagToTag = <Msg>(
    update: UpdateFn,
    { oldTag, newTag, renderers, dispatch }: UpdateTagToTag<Msg>
): Linked.Tag => {
    const children: Linked.VNode[] = [];

    for (const [index, child] of newTag.children.entries()) {
        const newChild = update({
            renderers,
            oldVNode: oldTag.children[index],
            newVNode: child,
            parentElement: oldTag.linkedElement,
            dispatch,
        });

        children.push(newChild);
    }

    return {
        type: "tag",
        tagName: newTag.tagName,
        children,
        linkedElement: oldTag.linkedElement,
    };
};
