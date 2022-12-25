import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";
import { VText } from "../../vnode";

type UpdateFragmentToTextArgs = {
    newText: VText;
    parentElement: HTMLElement;
    renderers: Renderers;
};

export const updateFragmentToText = ({
    newText,
    parentElement,
    renderers,
}: UpdateFragmentToTextArgs): Linked.VText => {
    const text = renderers.text(newText);

    parentElement.appendChild(text.linkedElement);

    return {
        type: "text",
        text: newText.text,
        linkedElement: text.linkedElement,
    };
};
