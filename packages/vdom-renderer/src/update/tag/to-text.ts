import * as Linked from "../../linked-vnode";
import { Renderers } from "../../renderers";
import { VText } from "../../vnode";

type UpdateTagToTextArgs<Msg> = {
    oldTag: Linked.Tag<Msg>;
    newText: VText;
    renderers: Renderers;
    parentElement: HTMLElement;
};

export const updateTagToText = <Msg>({
    oldTag,
    newText,
    renderers,
    parentElement,
}: UpdateTagToTextArgs<Msg>): Linked.VText => {
    parentElement.removeChild(oldTag.linkedElement);

    const text = renderers.text(newText);

    parentElement.appendChild(text.linkedElement);

    return text;
};
