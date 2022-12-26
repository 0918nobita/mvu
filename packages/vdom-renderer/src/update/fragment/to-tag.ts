import { Dispatch } from "@0918nobita-mvu/renderer";

import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";
import { Tag } from "../../vnode";

type UpdateFragmentToTagArgs<Msg> = {
    newTag: Tag<Msg>;
    renderers: Renderers;
    parentElement: HTMLElement;
    dispatch: Dispatch<Msg>;
};

export const updateFragmentToTag = <Msg>({
    newTag,
    renderers,
    parentElement,
    dispatch,
}: UpdateFragmentToTagArgs<Msg>): Linked.Tag<Msg> => {
    const tag = renderers.tag(renderers, {
        vnodeTag: newTag,
        dispatch,
    });

    parentElement.appendChild(tag.linkedElement);

    return tag;
};
