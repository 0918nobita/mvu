import { Renderer } from "@0918nobita-mvu/renderer";

export const consoleRenderer: Renderer<string> = (view) => {
    console.log(view);
};
