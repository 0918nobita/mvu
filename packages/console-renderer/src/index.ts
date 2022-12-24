import { Renderer } from "@0918nobita-mvu/renderer";

export const consoleRenderer: Renderer<string, unknown> = (view) => {
    console.log(view);
};
