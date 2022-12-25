import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";
import { VText } from "../../vnode";

type UpdateTagToTextArgs = {
    oldTag: Linked.Tag;
    newText: VText;
    renderers: Renderers;
    parentElement: HTMLElement;
};

export const updateTagToText = ({
    oldTag,
    newText,
    renderers,
    parentElement,
}: UpdateTagToTextArgs): Linked.VText => {
    parentElement.removeChild(oldTag.linkedElement);

    const text = renderers.text(newText);

    parentElement.appendChild(text.linkedElement);

    return text;
};
