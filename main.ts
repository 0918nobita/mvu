import { Cmd, Dispatch } from "./cmd.ts";
import { Program, Sub, Subs, run } from "./program.ts";

interface Arg {
    initialCount: number;
}

interface Model {
    count: number;
}

type Msg = "increment" | "reset";

const init = (arg: Arg): [Model, Cmd<Msg>] => [
    { count: arg.initialCount },
    Cmd.none,
];

const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg) {
        case "increment":
            return [{ count: model.count + 1 }, Cmd.none];

        case "reset":
            return [{ count: 0 }, Cmd.none];
    }
};

const subID = Symbol("reset");

const sub: Sub<Msg> = (dispatch) => {
    const id = setInterval(() => {
        dispatch("reset");
    }, 3000);

    return {
        dispose: () => {
            clearInterval(id);
        },
    };
};

const subs = Subs.singleton(subID, sub);

const subscriptions = (_model: Model): Subs<Msg> => subs;

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
