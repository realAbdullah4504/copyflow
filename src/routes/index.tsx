import { createBrowserRouter } from "react-router-dom";

const routes = [
  {
    path: "/",
    component: () => <div>Home</div>,
  },
];

export const router = createBrowserRouter(routes);
