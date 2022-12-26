import { Dispatch } from "@0918nobita-mvu/renderer";

import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";
import { updateEventHandler } from "../../update-event-handler";
import { Tag } from "../../vnode";
import { UpdateFn } from "../sig";

type UpdateTagToTag<Msg> = {
    oldTag: Linked.Tag<Msg>;
    newTag: Tag<Msg>;
    renderers: Renderers;
    parentElement: HTMLElement;
    dispatch: Dispatch<Msg>;
};

export const updateTagToTag = <Msg>(
    update: UpdateFn,
    { oldTag, newTag, renderers, dispatch, parentElement }: UpdateTagToTag<Msg>
): Linked.Tag<Msg> => {
    if (oldTag.tagName !== newTag.tagName) {
        const element = renderers.tag(renderers, {
            vnodeTag: newTag,
            dispatch,
        });
        parentElement.replaceChild(element.linkedElement, oldTag.linkedElement);
        return element;
    }

    for (const attrName in oldTag.attrs) {
        if (!(attrName in newTag.attrs)) {
            oldTag.linkedElement.removeAttribute(attrName);
        }
    }

    for (const attrName in newTag.attrs) {
        if (oldTag.attrs[attrName] !== newTag.attrs[attrName]) {
            oldTag.linkedElement.setAttribute(attrName, newTag.attrs[attrName]);
        }
    }

    const eventHandlers = updateEventHandler(
        oldTag.linkedElement,
        oldTag.eventHandlers,
        oldTag.events,
        newTag.events,
        dispatch
    );

    const children: Linked.VNode<Msg>[] = [];

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
        events: newTag.events,
        eventHandlers,
    };
};
