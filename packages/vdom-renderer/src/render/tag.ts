import * as Linked from "../linked-vnode";
import { Renderers, TagRendererArgs } from "./renderers";

export const renderTag = <Msg>(
    renderers: Renderers,
    { vnodeTag, dispatch }: TagRendererArgs<Msg>
): Linked.Tag => {
    const tag = document.createElement(vnodeTag.tagName);

    const children: Linked.VNode[] = [];

    for (const child of vnodeTag.children) {
        switch (child.type) {
            case "fragment":
                const fragment = renderers.fragment<Msg>(renderers, {
                    dispatch,
                    parentElement: tag,
                    vnodeFragment: child,
                });
                children.push(...fragment.children);
                break;

            case "tag":
                const nestedTag = renderers.tag<Msg>(renderers, {
                    vnodeTag,
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

    for (const [eventName, msg] of Object.entries(vnodeTag.events)) {
        if (eventName === "click") {
            tag.addEventListener("click", () => {
                dispatch(msg);
            });
            continue;
        }

        console.warn("Unknown event: ", eventName);
    }

    return {
        type: "tag",
        tagName: vnodeTag.tagName,
        children,
        linkedElement: tag,
    };
};
