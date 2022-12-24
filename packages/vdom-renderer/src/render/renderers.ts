import { Dispatch } from "@0918nobita-mvu/renderer";
import * as Linked from "../linked-vnode";
import * as VNode from "../vnode";

export type FragmentRendererArgs<Msg> = {
    vnodeFragment: VNode.Fragment<Msg>;
    parentElement: HTMLElement;
    dispatch: Dispatch<Msg>;
};

export type TagRendererArgs<Msg> = {
    vnodeTag: VNode.Tag<Msg>;
    dispatch: Dispatch<Msg>;
};

export type Renderers = {
    fragment: <Msg>(
        renderers: Renderers,
        args: FragmentRendererArgs<Msg>
    ) => Linked.Fragment;

    tag: <Msg>(renderers: Renderers, args: TagRendererArgs<Msg>) => Linked.Tag;

    text: (vnodeText: VNode.VText) => Linked.VText;
};
