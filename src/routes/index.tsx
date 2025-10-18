import { createBrowserRouter } from "react-router-dom";
import { appRoutes } from "./appRoutes";
import { privateRoutes } from "./privateRoutes";

export const router = createBrowserRouter([...appRoutes,...privateRoutes]);
