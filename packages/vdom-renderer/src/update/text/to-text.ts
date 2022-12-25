import * as Linked from "../../linked-vnode";
import { VText } from "../../vnode";

type UpdateTextToTextArgs = {
    oldText: Linked.VText;
    newText: VText;
};

export const updateTextToText = ({
    oldText,
    newText,
}: UpdateTextToTextArgs): Linked.VText => {
    if (oldText.text === newText.text) return oldText;

    oldText.linkedElement.textContent = newText.text;

    return {
        type: "text",
        text: newText.text,
        linkedElement: oldText.linkedElement,
    };
};
