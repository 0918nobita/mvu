import { Events, Fragment, VNode, VText } from "./vnode";

export const fragment = <Msg>(
    ...children: Array<VNode<Msg>>
): Fragment<Msg> => ({
    type: "fragment",
    children,
});

export const text = (text: string): VText => ({
    type: "text",
    text,
});

export const div = <Msg>(
    attrs: Record<string, string> = {},
    events: Events<Msg> = {},
    children: Array<VNode<Msg>> = []
): VNode<Msg> => ({
    type: "tag",
    tagName: "div",
    attrs,
    children,
    events,
});

export const p = <Msg>(
    attrs: Record<string, string> = {},
    events: Events<Msg> = {},
    children: Array<VNode<Msg>> = []
): VNode<Msg> => ({
    type: "tag",
    tagName: "p",
    attrs,
    children,
    events,
});

export const button = <Msg>(
    attrs: Record<string, string> = {},
    events: Events<Msg> = {},
    children: Array<VNode<Msg>> = []
): VNode<Msg> => ({
    type: "tag",
    tagName: "button",
    attrs,
    children,
    events,
});

export const input = <Msg>(
    attrs: Record<string, string> = {},
    events: Events<Msg> = {}
): VNode<Msg> => ({
    type: "tag",
    tagName: "input",
    attrs,
    events,
    children: [],
});

export const img = <Msg>(
    attrs: Record<string, string> = {},
    events: Events<Msg> = {}
): VNode<Msg> => ({
    type: "tag",
    tagName: "img",
    attrs,
    children: [],
    events,
});
