import { Dispatch } from "@0918nobita-mvu/renderer";

import { UpdateFn } from "../sig";
import { Fragment } from "../../vnode";
import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";

type UpdateFragmentToFragmentArgs<Msg> = {
    oldFragment: Linked.Fragment;
    newFragment: Fragment<Msg>;
    parentElement: HTMLElement;
    renderers: Renderers;
    dispatch: Dispatch<Msg>;
};

export const updateFragmentToFragment = <Msg>(
    update: UpdateFn,
    {
        oldFragment,
        newFragment,
        parentElement,
        renderers,
        dispatch,
    }: UpdateFragmentToFragmentArgs<Msg>
): Linked.Fragment => {
    const children: Linked.VNode[] = [];

    if (oldFragment.children.length >= newFragment.children.length) {
        for (let i = 0; i < newFragment.children.length; i++) {
            const newChild = update({
                renderers,
                oldVNode: oldFragment.children[i],
                newVNode: newFragment.children[i],
                parentElement,
                dispatch,
            });

            children.push(newChild);
        }

        for (
            let i = newFragment.children.length;
            i < oldFragment.children.length;
            i++
        ) {
            parentElement.removeChild(parentElement.lastChild!);
        }
    } else {
        for (let i = 0; i < oldFragment.children.length; i++) {
            const newChild = update({
                renderers,
                oldVNode: oldFragment.children[i],
                newVNode: newFragment.children[i],
                parentElement,
                dispatch,
            });

            children.push(newChild);
        }

        for (
            let i = oldFragment.children.length;
            i < newFragment.children.length;
            i++
        ) {
            const newChild = newFragment.children[i];

            if (newChild.type === "fragment") {
                const fragment = renderers.fragment<Msg>(renderers, {
                    vnodeFragment: newChild,
                    parentElement,
                    dispatch,
                });
                children.push(...fragment.children);
                continue;
            }

            if (newChild.type === "text") {
                const text = renderers.text(newChild);
                parentElement.appendChild(text.linkedElement);
                children.push(text);
                continue;
            }

            const tag = renderers.tag<Msg>(renderers, {
                vnodeTag: newChild,
                dispatch,
            });
            parentElement.appendChild(tag.linkedElement);
            children.push(tag);
        }
    }

    return { type: "fragment", children };
};
