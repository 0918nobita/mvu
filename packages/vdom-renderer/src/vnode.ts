export type VText = {
    type: "text";
    text: string;
};

export type Tag<Msg> = {
    type: "tag";
    tagName: string;
    attrs: Record<string, string>;
    children: VNode<Msg>[];
    events: Record<string, Msg>;
};

export type Fragment<Msg> = {
    type: "fragment";
    children: VNode<Msg>[];
};

export type VNode<Msg> = VText | Tag<Msg> | Fragment<Msg>;
