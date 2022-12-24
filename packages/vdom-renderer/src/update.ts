import { Dispatch } from "@0918nobita-mvu/renderer";

import * as Linked from "./linked-vnode";
import { Renderers } from "./render";
import { VNode } from "./vnode";

type UpdateFnParams<Msg> = {
    renderers: Renderers;
    oldVNode: Linked.VNode;
    newVNode: VNode<Msg>;
    parentElement: HTMLElement;
    dispatch: Dispatch<Msg>;
};

export const update = <Msg>({
    renderers,
    oldVNode,
    newVNode,
    parentElement,
    dispatch,
}: UpdateFnParams<Msg>): Linked.VNode => {
    if (oldVNode.type === "fragment") {
        if (newVNode.type === "fragment") {
            const children: Linked.VNode[] = [];

            if (oldVNode.children.length >= newVNode.children.length) {
                for (let i = 0; i < newVNode.children.length; i++) {
                    const newChild = update({
                        renderers,
                        oldVNode: oldVNode.children[i],
                        newVNode: newVNode.children[i],
                        parentElement,
                        dispatch,
                    });

                    children.push(newChild);
                }

                for (
                    let i = newVNode.children.length;
                    i < oldVNode.children.length;
                    i++
                ) {
                    parentElement.removeChild(parentElement.lastChild!);
                }
            } else {
                for (let i = 0; i < oldVNode.children.length; i++) {
                    const newChild = update({
                        renderers,
                        oldVNode: oldVNode.children[i],
                        newVNode: newVNode.children[i],
                        parentElement,
                        dispatch,
                    });

                    children.push(newChild);
                }

                for (
                    let i = oldVNode.children.length;
                    i < newVNode.children.length;
                    i++
                ) {
                    const newChild = newVNode.children[i];

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
        }

        if (newVNode.type === "text") {
            const text = renderers.text(newVNode);

            parentElement.appendChild(text.linkedElement);

            return {
                type: "text",
                text: newVNode.text,
                linkedElement: text.linkedElement,
            };
        }

        const tag = renderers.tag<Msg>(renderers, {
            vnodeTag: newVNode,
            dispatch,
        });

        parentElement.appendChild(tag.linkedElement);

        return tag;
    }

    if (oldVNode.type === "text") {
        if (newVNode.type === "fragment") {
            parentElement.removeChild(oldVNode.linkedElement);

            return renderers.fragment<Msg>(renderers, {
                vnodeFragment: newVNode,
                parentElement,
                dispatch,
            });
        }

        if (newVNode.type === "text") {
            if (oldVNode.text === newVNode.text) return oldVNode;

            oldVNode.linkedElement.textContent = newVNode.text;

            return {
                type: "text",
                text: newVNode.text,
                linkedElement: oldVNode.linkedElement,
            };
        }

        parentElement.removeChild(oldVNode.linkedElement);

        const tag = renderers.tag<Msg>(renderers, {
            vnodeTag: newVNode,
            dispatch,
        });

        parentElement.appendChild(tag.linkedElement);

        return tag;
    }

    if (newVNode.type === "fragment") {
        parentElement.removeChild(oldVNode.linkedElement);

        return renderers.fragment<Msg>(renderers, {
            vnodeFragment: newVNode,
            parentElement,
            dispatch,
        });
    }

    if (newVNode.type === "text") {
        parentElement.removeChild(oldVNode.linkedElement);

        const text = renderers.text(newVNode);

        parentElement.appendChild(text.linkedElement);

        return text;
    }

    const children: Linked.VNode[] = [];

    for (const [index, child] of newVNode.children.entries()) {
        const newChild = update({
            renderers,
            oldVNode: oldVNode.children[index],
            newVNode: child,
            parentElement: oldVNode.linkedElement,
            dispatch,
        });

        children.push(newChild);
    }

    return {
        type: "tag",
        tagName: newVNode.tagName,
        children,
        linkedElement: oldVNode.linkedElement,
    };
};
