import * as Linked from "../linked-vnode";
import { FragmentRendererArgs, Renderers } from "./renderers";

export const renderFragment = <Msg>(
    renderers: Renderers,
    { vnodeFragment, dispatch, parentElement }: FragmentRendererArgs<Msg>
): Linked.Fragment => {
    const children: Linked.VNode[] = [];

    for (const child of vnodeFragment.children) {
        switch (child.type) {
            case "fragment":
                const nestedFragment = renderers.fragment<Msg>(renderers, {
                    vnodeFragment: child,
                    parentElement,
                    dispatch,
                });
                children.push(...nestedFragment.children);
                break;

            case "tag":
                const tag = renderers.tag<Msg>(renderers, {
                    vnodeTag: child,
                    dispatch,
                });
                children.push(tag);
                parentElement.appendChild(tag.linkedElement);
                break;

            case "text":
                const text = renderers.text(child);
                children.push(text);
                parentElement.appendChild(text.linkedElement);
        }
    }

    return { type: "fragment", children };
};
