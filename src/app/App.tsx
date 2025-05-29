import { RouterProvider } from "react-router/dom";
import { routerConfig } from "./router";

export const App = () => {
  return <RouterProvider router={routerConfig} />;
};
