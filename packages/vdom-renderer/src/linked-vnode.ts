export type VText = {
    type: "text";
    text: string;
    linkedElement: Text;
};

type Events<Msg> = Partial<{
    click: Msg;
    input: (value: string) => Msg;
}>;

export type EventName = "click" | "input";

export type EventHandlers = Map<EventName, EventListener>;

export type Tag<Msg> = {
    type: "tag";
    tagName: string;
    attrs: Record<string, string>;
    children: VNode<Msg>[];
    linkedElement: HTMLElement;
    events: Events<Msg>;
    eventHandlers: EventHandlers;
};

export type Fragment<Msg> = {
    type: "fragment";
    children: VNode<Msg>[];
};

export type VNode<Msg> = VText | Tag<Msg> | Fragment<Msg>;
