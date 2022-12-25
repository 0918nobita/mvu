import { Cmd, Sub, Program, run } from "@0918nobita-mvu/framework";
import {
    VNode,
    createRenderer,
    fragment,
    p,
    text,
    button,
} from "@0918nobita-mvu/vdom-renderer";

// ARGUMENT

type Arg = {
    initialCount: number;
};

// MODEL

type Model = {
    count: number;
};

// MESSAGE

type Msg = { type: "increment" } | { type: "reset" };

// INIT

const init = (arg: Arg): [Model, Cmd<Msg>] => [
    { count: arg.initialCount },
    Cmd.none,
];

// UPDATE

const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg.type) {
        case "increment":
            return [{ count: model.count + 1 }, Cmd.none];

        case "reset":
            return [{ count: 0 }, Cmd.none];
    }
};

// SUBSCRIPTIONS

const subscriptions = (_model: Model): Sub<Msg> => Sub.none();

// VIEW

const view = (model: Model): VNode<Msg> =>
    fragment(
        p({}, {}, [text(`Count: ${model.count}`)]),
        button({}, { click: { type: "increment" } }, [text("+1")]),
        button({}, { click: { type: "reset" } }, [text("reset")])
    );

// MAIN

const program: Program<Arg, Model, Msg, VNode<Msg>> = {
    init,
    update,
    subscriptions,
    view,
};

run(
    program,
    { initialCount: 0 },
    createRenderer(document.getElementById("app")!)
);
