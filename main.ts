import { Cmd, Dispatch } from "./cmd.ts";
import { Program, run } from "./program.ts";
import { Sub, TaskWithDispatch } from "./sub.ts";

// ARGUMENT

interface Arg {
    initialCount: number;
}

// MODEL

interface Model {
    count: number;
}

// MESSAGE

type Msg =
    | { type: "getRandomNum" }
    | {
          type: "randomNumReceived";
          num: number;
      }
    | { type: "increment" }
    | { type: "reset" };

// INIT

const init = (arg: Arg): [Model, Cmd<Msg>] => [
    { count: arg.initialCount },
    Cmd.none,
];

// UPDATE

const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg.type) {
        case "getRandomNum":
            return [model, getRandomNum];

        case "randomNumReceived":
            return [{ count: msg.num }, Cmd.none];

        case "increment":
            return [{ count: model.count + 1 }, Cmd.none];

        case "reset":
            return [{ count: 0 }, Cmd.none];
    }
};

// COMMAND

const getRandomNum: Cmd<Msg> = Cmd.ofEffect(async (dispatch) => {
    const res = await fetch(
        "http://www.randomnumberapi.com/api/v1.0/random?min=100&max=500"
    );
    const data: number[] = await res.json();
    console.log("%cRandom number received", "color: green");
    dispatch({ type: "randomNumReceived", num: data[0] });
});

// SUBSCRIPTIONS

const taskID = Symbol("reset");

const task: TaskWithDispatch<Msg> = (dispatch) => {
    const id = setInterval(() => {
        dispatch({ type: "increment" });
    }, 1000);

    return {
        dispose: () => {
            clearInterval(id);
        },
    };
};

const sub = Sub.ofTask(taskID, task);

const subscriptions = (_model: Model): Sub<Msg> => sub;

// VIEW

let timeoutSet = false;

const view = (model: Model, dispatch: Dispatch<Msg>) => {
    if (!timeoutSet) {
        setTimeout(() => {
            dispatch({ type: "getRandomNum" });
        }, 3000);
        timeoutSet = true;
    }

    return `Count: ${model.count}`;
};

// MAIN

const program: Program<Arg, Model, Msg, string> = {
    init,
    update,
    subscriptions,
    view,
};

run(program, { initialCount: 0 });
