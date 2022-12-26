import { Dispatch } from "@0918nobita-mvu/renderer";

import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";
import { Fragment } from "../../vnode";

type UpdateTagToFragmentArgs<Msg> = {
    oldTag: Linked.Tag<Msg>;
    newFragment: Fragment<Msg>;
    renderers: Renderers;
    parentElement: HTMLElement;
    dispatch: Dispatch<Msg>;
};

export const updateTagToFragment = <Msg>({
    oldTag,
    newFragment,
    renderers,
    parentElement,
    dispatch,
}: UpdateTagToFragmentArgs<Msg>): Linked.Fragment<Msg> => {
    parentElement.removeChild(oldTag.linkedElement);

    return renderers.fragment(renderers, {
        vnodeFragment: newFragment,
        parentElement,
        dispatch,
    });
};
