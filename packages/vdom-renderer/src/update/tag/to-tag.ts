import { Dispatch } from "@0918nobita-mvu/renderer";

import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";
import { Tag } from "../../vnode";
import { UpdateFn } from "../sig";

type UpdateTagToTag<Msg> = {
    oldTag: Linked.Tag;
    newTag: Tag<Msg>;
    renderers: Renderers;
    parentElement: HTMLElement;
    dispatch: Dispatch<Msg>;
};

export const updateTagToTag = <Msg>(
    update: UpdateFn,
    { oldTag, newTag, renderers, dispatch, parentElement }: UpdateTagToTag<Msg>
): Linked.Tag => {
    if (oldTag.tagName !== newTag.tagName) {
        const element = renderers.tag<Msg>(renderers, {
            vnodeTag: newTag,
            dispatch,
        });
        parentElement.replaceChild(element.linkedElement, oldTag.linkedElement);
        return element;
    }

    for (const name of Object.keys(oldTag.attrs)) {
        if (!(name in newTag.attrs)) {
            oldTag.linkedElement.removeAttribute(name);
        }
    }

    for (const [name, value] of Object.entries(newTag.attrs)) {
        if (oldTag.attrs[name] !== value) {
            oldTag.linkedElement.setAttribute(name, value);
        }
    }

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
        attrs: newTag.attrs,
        children,
        linkedElement: oldTag.linkedElement,
    };
};
