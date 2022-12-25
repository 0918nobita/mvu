import { Cmd, Sub, Program, run } from "@0918nobita-mvu/framework";
import {
    VNode,
    createRenderer,
    img,
    p,
    text,
    div,
    fragment,
    button,
} from "@0918nobita-mvu/vdom-renderer";

// ARGUMENT

type Arg = {};

// MODEL

type Model = {
    imgSrc: string | null;
};

// MESSAGE

type Msg = { type: "fetchNewImg" } | { type: "imgFetched"; imgSrc: string };

// COMMANDS

const fetchNewImg = Cmd.ofEffect<Msg>(async (dispatch) => {
    const res = await fetch("https://aws.random.cat/meow");
    const data: { file: string } = await res.json();
    dispatch({ type: "imgFetched", imgSrc: data.file });
});

// INIT

const init = ({}: Arg): [Model, Cmd<Msg>] => [
    {
        imgSrc: null,
    },
    fetchNewImg,
];

// UPDATE

const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg.type) {
        case "fetchNewImg":
            return [model, fetchNewImg];

        case "imgFetched":
            return [{ imgSrc: msg.imgSrc }, Cmd.none];
    }
};

// SUBSCRIPTIONS

const subscriptions = (_model: Model): Sub<Msg> => Sub.none();

// VIEW

const view = (model: Model): VNode<Msg> =>
    fragment(
        div({}, {}, [
            button({}, { click: { type: "fetchNewImg" } }, [
                text("Fetch New Image"),
            ]),
        ]),
        model.imgSrc !== null
            ? img(
                  {
                      src: model.imgSrc,
                      alt: "Random Cat Image",
                      width: "500px",
                  },
                  {}
              )
            : p({}, {}, [text("Now Loading...")])
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
