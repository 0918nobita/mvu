import { Cmd, Sub, Program, run } from "@0918nobita-mvu/framework";
import {
    VNode,
    createRenderer,
    fragment,
    p,
    text,
    input,
} from "@0918nobita-mvu/vdom-renderer";

// ARGUMENT

type Arg = {};

// MODEL

type Model = {
    name: string;
};

// MESSAGE

type Msg = { type: "change"; name: string };

// INIT

const init = ({}: Arg): [Model, Cmd<Msg>] => [{ name: "world" }, Cmd.none];

// UPDATE

const update = (msg: Msg, _model: Model): [Model, Cmd<Msg>] => {
    switch (msg.type) {
        case "change":
            return [{ name: msg.name === "" ? "world" : msg.name }, Cmd.none];
    }
};

// SUBSCRIPTIONS

const subscriptions = (_model: Model): Sub<Msg> => Sub.none();

// VIEW

const view = (model: Model): VNode<Msg> =>
    fragment(
        p({}, {}, [text(`Hello, ${model.name}`)]),
        input(
            { type: "text", placeholder: "Name" },
            { input: (value) => ({ type: "change", name: value }) }
        )
    );

// MAIN

const program: Program<Arg, Model, Msg, VNode<Msg>> = {
    init,
    update,
    subscriptions,
    view,
};

run(program, {}, createRenderer(document.getElementById("app")!));
