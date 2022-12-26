import * as Linked from "../linked-vnode";
import { Renderers, TagRendererArgs } from "../renderers";
import { setEventHandler } from "../set-event-handler";

export const renderTag = <Msg>(
    renderers: Renderers,
    { vnodeTag, dispatch }: TagRendererArgs<Msg>
): Linked.Tag<Msg> => {
    const tag = document.createElement(vnodeTag.tagName);

    const children: Linked.VNode<Msg>[] = [];

    for (const child of vnodeTag.children) {
        switch (child.type) {
            case "fragment":
                const fragment = renderers.fragment(renderers, {
                    dispatch,
                    parentElement: tag,
                    vnodeFragment: child,
                });
                children.push(...fragment.children);
                break;

            case "tag":
                const nestedTag = renderTag(renderers, {
                    vnodeTag: child,
                    dispatch,
                });
                children.push(nestedTag);
                tag.appendChild(nestedTag.linkedElement);
                break;

            case "text":
                const text = renderers.text(child);
                children.push(text);
                tag.appendChild(text.linkedElement);
        }
    }

    for (const [attrName, value] of Object.entries(vnodeTag.attrs)) {
        tag.setAttribute(attrName, value);
    }

    const eventHandlers = setEventHandler(tag, vnodeTag.events, dispatch);

    return {
        type: "tag",
        tagName: vnodeTag.tagName,
        attrs: vnodeTag.attrs,
        children,
        linkedElement: tag,
        events: vnodeTag.events,
        eventHandlers,
    };
};
