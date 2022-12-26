import { Dispatch } from "@0918nobita-mvu/renderer";

import * as Linked from "../linked-vnode";
import { Renderers } from "../renderers";
import { VNode } from "../vnode";

type UpdateFnArgs<Msg> = {
    renderers: Renderers;
    oldVNode: Linked.VNode<Msg>;
    newVNode: VNode<Msg>;
    parentElement: HTMLElement;
    dispatch: Dispatch<Msg>;
};

export type UpdateFn = <Msg>(args: UpdateFnArgs<Msg>) => Linked.VNode<Msg>;
