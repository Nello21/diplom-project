import { PhaseGraphic } from "@/pages/2d-graphic";
import { VanDerPolGraphic } from "@/pages/3d-graphic";
import { NotFound } from "@/pages/not-found";
import { ROUTES } from "@/shared/consts/routes";
import { BaseLayout } from "@/shared/layout";
import { createBrowserRouter } from "react-router";

export const routerConfig = createBrowserRouter([
  {
    path: ROUTES.vanderpol,
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <VanDerPolGraphic />,
      },
      {
        path: ROUTES.averagedSystem,
        element: <PhaseGraphic />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
