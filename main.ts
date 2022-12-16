import * as C from "./cmd";
import { Cmd } from "./cmd";

interface Program<Arg, Model, Msg, View> {
    init: (arg: Arg) => [Model, Cmd<Msg>];
}

console.log(C.none);

type VNode =
    | {
          type: "text";
          content: string;
      }
    | {
          type: "node";
          tag: string;
          attrs: Record<string, string | Function>;
          children: VNode[];
      }
    | {
          type: "fragment";
          children: VNode[];
      };

const vnode: VNode = {
    type: "node",
    tag: "p",
    attrs: {},
    children: [
        {
            type: "text",
            content: "Hello, world!",
        },
    ],
};
