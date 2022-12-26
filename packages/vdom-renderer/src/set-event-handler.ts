import { Dispatch } from "@0918nobita-mvu/renderer";

import { EventHandlers } from "./linked-vnode";
import { Events } from "./vnode";

export const setEventHandler = <Msg>(
    htmlElement: HTMLElement,
    events: Events<Msg>,
    dispatch: Dispatch<Msg>
): EventHandlers => {
    const eventHandlers: EventHandlers = new Map();

    for (const eventName in events) {
        if (eventName === "click") {
            const msg = events[eventName];
            if (!msg) continue;

            const clickEventHandler = () => dispatch(msg);
            htmlElement.addEventListener("click", clickEventHandler);

            eventHandlers.set("click", clickEventHandler);
            continue;
        }

        if (eventName === "input") {
            const msgConstructor = events[eventName];
            if (!msgConstructor) continue;

            const inputEventHandler = (event: Event) => {
                const target = event.target as HTMLInputElement;
                dispatch(msgConstructor(target.value));
            };
            htmlElement.addEventListener("input", inputEventHandler);

            eventHandlers.set("input", inputEventHandler);
            continue;
        }

        console.warn("Unknown event:", eventName);
    }

    return eventHandlers;
};
