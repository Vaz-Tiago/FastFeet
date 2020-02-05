import { Router } from "express";

import IndexController from "./app/controllers/IndexController";
import SessionController from "./app/controllers/SessionController";
import RecipientController from "./app/controllers/RecipientController";

import auth from "./app/middlewares/auth";

const routes = new Router();

routes.get("/", IndexController.index);
routes.post("/session", SessionController.store);

routes.use(auth);
routes.post("/recipients", RecipientController.store);
routes.put("/recipients", RecipientController.update);

export default routes;
