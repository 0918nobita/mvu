import { UpdateFn } from "./sig";
import {
    updateFragmentToFragment,
    updateFragmentToTag,
    updateFragmentToText,
} from "./fragment";
import { updateTagToFragment, updateTagToTag, updateTagToText } from "./tag";
import {
    updateTextToFragment,
    updateTextToTag,
    updateTextToText,
} from "./text";

export const update: UpdateFn = ({
    renderers,
    oldVNode,
    newVNode,
    parentElement,
    dispatch,
}) => {
    if (oldVNode.type === "fragment") {
        if (newVNode.type === "fragment")
            return updateFragmentToFragment(update, {
                oldFragment: oldVNode,
                newFragment: newVNode,
                parentElement,
                renderers,
                dispatch,
            });

        if (newVNode.type === "text")
            return updateFragmentToText({
                newText: newVNode,
                parentElement,
                renderers,
            });

        return updateFragmentToTag({
            newTag: newVNode,
            parentElement,
            renderers,
            dispatch,
        });
    }

    if (oldVNode.type === "text") {
        if (newVNode.type === "fragment")
            return updateTextToFragment({
                oldText: oldVNode,
                newFragment: newVNode,
                parentElement,
                renderers,
                dispatch,
            });

        if (newVNode.type === "text")
            return updateTextToText({
                oldText: oldVNode,
                newText: newVNode,
            });

        return updateTextToTag({
            oldText: oldVNode,
            newTag: newVNode,
            renderers,
            parentElement,
            dispatch,
        });
    }

    if (newVNode.type === "fragment")
        return updateTagToFragment({
            oldTag: oldVNode,
            newFragment: newVNode,
            renderers,
            parentElement,
            dispatch,
        });

    if (newVNode.type === "text")
        return updateTagToText({
            oldTag: oldVNode,
            newText: newVNode,
            renderers,
            parentElement,
        });

    return updateTagToTag(update, {
        oldTag: oldVNode,
        newTag: newVNode,
        renderers,
        parentElement,
        dispatch,
    });
};
