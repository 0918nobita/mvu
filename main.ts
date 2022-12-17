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
