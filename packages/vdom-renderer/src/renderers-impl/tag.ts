import * as Linked from "../linked-vnode";
import { Renderers, TagRendererArgs } from "../renderers";

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

    for (const eventName in vnodeTag.events) {
        if (eventName === "click") {
            const msg = vnodeTag.events[eventName];
            if (!msg) continue;
            tag.addEventListener("click", () => {
                dispatch(msg);
            });
            continue;
        }

        if (eventName === "input") {
            const msgConstructor = vnodeTag.events[eventName];
            if (!msgConstructor) continue;
            tag.addEventListener("input", (event) => {
                const target = event.target as HTMLInputElement;
                dispatch(msgConstructor(target.value));
            });
            continue;
        }

        console.warn("Unknown event:", eventName);
    }

    return {
        type: "tag",
        tagName: vnodeTag.tagName,
        attrs: vnodeTag.attrs,
        children,
        linkedElement: tag,
    };
};
