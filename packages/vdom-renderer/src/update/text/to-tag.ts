import { Dispatch } from "@0918nobita-mvu/renderer";

import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";
import { Tag } from "../../vnode";

type UpdateTextToTagArgs<Msg> = {
    oldText: Linked.VText;
    newTag: Tag<Msg>;
    renderers: Renderers;
    parentElement: HTMLElement;
    dispatch: Dispatch<Msg>;
};

export const updateTextToTag = <Msg>({
    oldText,
    newTag,
    renderers,
    parentElement,
    dispatch,
}: UpdateTextToTagArgs<Msg>): Linked.Tag => {
    parentElement.removeChild(oldText.linkedElement);

    const tag = renderers.tag(renderers, {
        vnodeTag: newTag,
        dispatch,
    });

    parentElement.appendChild(tag.linkedElement);

    return tag;
};
