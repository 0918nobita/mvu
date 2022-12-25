import { renderFragment } from "./fragment";
import { Renderers } from "../renderers";
import { renderTag } from "./tag";
import { renderText } from "./text";

export const renderers: Renderers = {
    fragment: renderFragment,
    tag: renderTag,
    text: renderText,
};
