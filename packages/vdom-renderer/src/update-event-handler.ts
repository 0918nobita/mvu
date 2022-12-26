import { Dispatch } from "@0918nobita-mvu/renderer";

import { EventHandlers, EventName } from "./linked-vnode";
import { Events } from "./vnode";

export const updateEventHandler = <Msg>(
    htmlElement: HTMLElement,
    eventHandlers: EventHandlers,
    oldEvents: Events<Msg>,
    newEvents: Events<Msg>,
    dispatch: Dispatch<Msg>
): EventHandlers => {
    for (const eventName in oldEvents) {
        if (!(eventName in newEvents)) {
            const existingHandler = eventHandlers.get(eventName as EventName);
            if (existingHandler !== undefined) {
                htmlElement.removeEventListener(eventName, existingHandler);
                continue;
            }

            console.warn("Event handler not registered correctly:", eventName);
        }
    }

    const newEventHandlers: EventHandlers = new Map();

    for (const eventName in newEvents) {
        if (eventName === "click") {
            const msg = newEvents[eventName];
            if (!msg) continue;

            const existingHandler = eventHandlers.get("click");
            if (existingHandler !== undefined)
                htmlElement.removeEventListener("click", existingHandler);

            const clickEventHandler = () => dispatch(msg);
            htmlElement.addEventListener("click", clickEventHandler);

            newEventHandlers.set("click", clickEventHandler);
            continue;
        }

        if (eventName === "input") {
            const msgConstructor = newEvents[eventName];
            if (!msgConstructor) continue;

            const existingHandler = eventHandlers.get("input");
            if (existingHandler !== undefined)
                htmlElement.removeEventListener("input", existingHandler);

            const inputEventHandler = (event: Event) => {
                const target = event.target as HTMLInputElement;
                dispatch(msgConstructor(target.value));
            };
            htmlElement.addEventListener("input", inputEventHandler);

            newEventHandlers.set("input", inputEventHandler);
            continue;
        }

        console.warn("Unknown event:", eventName);
    }

    return newEventHandlers;
};
