export type VText = {
    type: "text";
    text: string;
    linkedElement: Text;
};

export type Tag = {
    type: "tag";
    tagName: string;
    children: VNode[];
    linkedElement: HTMLElement;
};

export type Fragment = {
    type: "fragment";
    children: VNode[];
};

export type VNode = VText | Tag | Fragment;
