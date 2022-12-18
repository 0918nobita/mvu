import { Cmd, Dispatch } from "./cmd.ts";
import { Program, run } from "./program.ts";
import { Sub } from "./sub.ts";

interface Arg {
    initialCount: number;
}

interface Model {
    count: number;
}

type Msg = "increment";

const init = (arg: Arg): [Model, Cmd<Msg>] => [
    { count: arg.initialCount },
    Cmd.none,
];

const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg) {
        case "increment":
            return [{ count: model.count + 1 }, Cmd.none];
    }
};

const subscriptions = (_model: Model): Sub<Msg> => Sub.none;

let intervalSet = false;

const view = (model: Model, dispatch: Dispatch<Msg>) => {
    if (!intervalSet) {
        setInterval(() => {
            dispatch("increment");
        }, 1000);

        intervalSet = true;
    }

    return `Count: ${model.count}`;
};

const program: Program<Arg, Model, Msg, string> = {
    init,
    update,
    subscriptions,
    view,
};

run(program, { initialCount: 0 });
