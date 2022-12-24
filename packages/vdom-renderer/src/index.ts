import { Renderer } from "@0918nobita-mvu/renderer";

export type VNodeText = {
    type: "text";
    text: string;
};

export type VNodeTag = {
    type: "tag";
    tagName: "p";
    children: VNode[];
};

export type VNodeFragment = {
    type: "fragment";
    children: VNode[];
};

export type VNode = VNodeText | VNodeTag | VNodeFragment;

export type LinkedVNodeText = {
    type: "text";
    text: string;
    linkedTextNode: Text;
};

export type LinkedVNodeTag = {
    type: "tag";
    tagName: "p";
    children: LinkedVNode[];
    linkedElement: HTMLParagraphElement;
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

function renderVNodeFragment(
    vnodeFragment: VNodeFragment,
    parentElement: HTMLElement
): LinkedVNodeFragment {
    const children: LinkedVNode[] = [];

    for (const child of vnodeFragment.children) {
        switch (child.type) {
            case "tag": {
                const renderedChild = renderVNodeTag(child);

                children.push(renderedChild);

                parentElement.appendChild(renderedChild.linkedElement);
                break;
            }

            case "fragment": {
                const renderedChild = renderVNodeFragment(child, parentElement);

                children.push(renderedChild);
                break;
            }
        }
    }

    return {
        type: "fragment",
        children,
    };
}

function renderVNodeTag(vnodeTag: VNodeTag): LinkedVNodeTag {
    const element = document.createElement(vnodeTag.tagName);

    const children: LinkedVNode[] = [];

    for (const child of vnodeTag.children) {
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
        tagName: vnodeTag.tagName,
        children,
        linkedElement: element,
    };
}

const update = (
    oldVNode: LinkedVNode,
    newVNode: VNode,
    parentElement: HTMLElement
): LinkedVNode => {
    if (oldVNode.type === "fragment") {
        if (newVNode.type === "fragment") {
            const children: LinkedVNode[] = [];

            for (const [index, child] of newVNode.children.entries()) {
                const newChild = update(
                    oldVNode.children[index],
                    child,
                    parentElement
                );

                children.push(newChild);
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

export const createRenderer = (root: HTMLElement): Renderer<VNode> => {
    let currentVNode: LinkedVNode = {
        type: "fragment",
        children: [],
    };

    const renderer: Renderer<VNode> = (vnode) => {
        const updated = update(currentVNode, vnode, root);
        currentVNode = updated;
    };

    return renderer;
};
