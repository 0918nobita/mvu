import { Renderer } from "@0918nobita-mvu/renderer";

export type VNodeText = {
    type: "text";
    text: string;
};

export type VNodeTag<Msg> = {
    type: "tag";
    tagName: string;
    children: VNode<Msg>[];
    events: Record<string, Msg>;
};

export type VNodeFragment<Msg> = {
    type: "fragment";
    children: VNode<Msg>[];
};

export type VNode<Msg> = VNodeText | VNodeTag<Msg> | VNodeFragment<Msg>;

export type LinkedVNodeText = {
    type: "text";
    text: string;
    linkedTextNode: Text;
};

export type LinkedVNodeTag = {
    type: "tag";
    tagName: string;
    children: LinkedVNode[];
    linkedElement: HTMLElement;
};

export type LinkedVNodeFragment = {
    type: "fragment";
    children: LinkedVNode[];
};

export type LinkedVNode =
    | LinkedVNodeText
    | LinkedVNodeTag
    | LinkedVNodeFragment;

const renderVNodeText = (vnodeText: VNodeText): LinkedVNodeText => {
    const textNode = document.createTextNode(vnodeText.text);

    return {
        type: "text",
        text: vnodeText.text,
        linkedTextNode: textNode,
    };
};

function renderVNodeFragment<Msg>(
    fragment: VNodeFragment<Msg>,
    parentElement: HTMLElement
): LinkedVNodeFragment {
    const children: LinkedVNode[] = [];

    for (const child of fragment.children) {
        switch (child.type) {
            case "tag": {
                const renderedChild = renderVNodeTag(child);

                children.push(renderedChild);

                parentElement.appendChild(renderedChild.linkedElement);
                break;
            }

            case "fragment": {
                const renderedChild = renderVNodeFragment(child, parentElement);

                children.push(...renderedChild.children);
                break;
            }
        }
    }

    return {
        type: "fragment",
        children,
    };
}

function renderVNodeTag<Msg>(tag: VNodeTag<Msg>): LinkedVNodeTag {
    const element = document.createElement(tag.tagName);

    const children: LinkedVNode[] = [];

    for (const child of tag.children) {
        switch (child.type) {
            case "fragment": {
                const fragment = renderVNodeFragment(child, element);

                children.push(...fragment.children);
                break;
            }

            case "text": {
                const text = renderVNodeText(child);

                children.push(text);

                element.appendChild(text.linkedTextNode);
                break;
            }

            case "tag": {
                const renderedChild = renderVNodeTag(child);

                element.appendChild(renderedChild.linkedElement);

                children.push(renderedChild);
                break;
            }
        }
    }
    return {
        type: "tag",
        tagName: tag.tagName,
        children,
        linkedElement: element,
    };
}

const update = <Msg>(
    oldVNode: LinkedVNode,
    newVNode: VNode<Msg>,
    parentElement: HTMLElement
): LinkedVNode => {
    if (oldVNode.type === "fragment") {
        if (newVNode.type === "fragment") {
            const children: LinkedVNode[] = [];

            if (oldVNode.children.length >= newVNode.children.length) {
                for (let i = 0; i < newVNode.children.length; i++) {
                    const newChild = update(
                        oldVNode.children[i],
                        newVNode.children[i],
                        parentElement
                    );

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
                    const newChild = update(
                        oldVNode.children[i],
                        newVNode.children[i],
                        parentElement
                    );

                    children.push(newChild);
                }

                for (
                    let i = oldVNode.children.length;
                    i < newVNode.children.length;
                    i++
                ) {
                    const newChild = newVNode.children[i];

                    if (newChild.type === "fragment") {
                        const fragment = renderVNodeFragment(
                            newChild,
                            parentElement
                        );
                        children.push(...fragment.children);
                        continue;
                    }

                    if (newChild.type === "text") {
                        const text = renderVNodeText(newChild);
                        parentElement.appendChild(text.linkedTextNode);
                        children.push(text);
                        continue;
                    }

                    const tag = renderVNodeTag(newChild);
                    parentElement.appendChild(tag.linkedElement);
                    children.push(tag);
                }
            }

            return { type: "fragment", children };
        }

        if (newVNode.type === "text") {
            const text = renderVNodeText(newVNode);

            parentElement.appendChild(text.linkedTextNode);

            return {
                type: "text",
                text: newVNode.text,
                linkedTextNode: text.linkedTextNode,
            };
        }

        const tag = renderVNodeTag(newVNode);

        parentElement.appendChild(tag.linkedElement);

        return tag;
    }

    if (oldVNode.type === "text") {
        if (newVNode.type === "fragment") {
            parentElement.removeChild(oldVNode.linkedTextNode);

            return renderVNodeFragment(newVNode, parentElement);
        }

        if (newVNode.type === "text") {
            oldVNode.linkedTextNode.textContent = newVNode.text;

            return {
                type: "text",
                text: newVNode.text,
                linkedTextNode: oldVNode.linkedTextNode,
            };
        }

        parentElement.removeChild(oldVNode.linkedTextNode);

        const tag = renderVNodeTag(newVNode);

        parentElement.appendChild(tag.linkedElement);

        return tag;
    }

    if (newVNode.type === "fragment") {
        parentElement.removeChild(oldVNode.linkedElement);

        return renderVNodeFragment(newVNode, parentElement);
    }

    if (newVNode.type === "text") {
        parentElement.removeChild(oldVNode.linkedElement);

        const text = renderVNodeText(newVNode);

        parentElement.appendChild(text.linkedTextNode);

        return text;
    }

    const children: LinkedVNode[] = [];

    for (const [index, child] of newVNode.children.entries()) {
        const newChild = update(
            oldVNode.children[index],
            child,
            oldVNode.linkedElement
        );

        children.push(newChild);
    }

    return {
        type: "tag",
        tagName: newVNode.tagName,
        children,
        linkedElement: oldVNode.linkedElement,
    };
};

export const createRenderer = <Msg>(
    root: HTMLElement
): Renderer<VNode<Msg>, Msg> => {
    let currentVNode: LinkedVNode = {
        type: "fragment",
        children: [],
    };

    const renderer: Renderer<VNode<Msg>, Msg> = (vnode) => {
        const updated = update(currentVNode, vnode, root);
        currentVNode = updated;
    };

    return renderer;
};
