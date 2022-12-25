import { Dispatch } from "@0918nobita-mvu/renderer";

import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";
import { Fragment } from "../../vnode";

type UpdateTextToFragmentArgs<Msg> = {
    oldText: Linked.VText;
    newFragment: Fragment<Msg>;
    renderers: Renderers;
    parentElement: HTMLElement;
    dispatch: Dispatch<Msg>;
};

export const updateTextToFragment = <Msg>({
    oldText,
    newFragment,
    renderers,
    parentElement,
    dispatch,
}: UpdateTextToFragmentArgs<Msg>): Linked.Fragment => {
    parentElement.removeChild(oldText.linkedElement);

    return renderers.fragment(renderers, {
        vnodeFragment: newFragment,
        parentElement,
        dispatch,
    });
};
