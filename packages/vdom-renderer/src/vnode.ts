export type VText = {
    type: "text";
    text: string;
};

export type Events<Msg> = Partial<{
    click: Msg;
    input: (value: string) => Msg;
}>;

export type Tag<Msg> = {
    type: "tag";
    tagName: string;
    attrs: Record<string, string>;
    children: VNode<Msg>[];
    events: Events<Msg>;
};

export type Fragment<Msg> = {
    type: "fragment";
    children: VNode<Msg>[];
};

export type VNode<Msg> = VText | Tag<Msg> | Fragment<Msg>;
