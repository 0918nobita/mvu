export type Dispatch<Msg> = (msg: Msg) => void;

export type Renderer<View, Msg> = (view: View, dispatch: Dispatch<Msg>) => void;
