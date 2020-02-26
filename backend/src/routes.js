import { Router } from "express";
import multer from "multer";

import multerConfigAvatar from "./config/multerAvatar";
import multerConfigSignature from "./config/multerSignature";

import SessionController from "./app/controllers/SessionController";
import RecipientController from "./app/controllers/RecipientController";
import DeliverymanController from "./app/controllers/DeliverymanController";
import FileAvatarController from "./app/controllers/FileAvatarController";
import FileSignatureController from "./app/controllers/FileSignatureController";
import DeliveryController from "./app/controllers/DeliveryController";

import auth from "./app/middlewares/auth";

const routes = new Router();

const avatarUpload = multer(multerConfigAvatar);
const signatureUpload = multer(multerConfigSignature);

routes.post("/session", SessionController.store);

routes.use(auth);

// Recipients
routes.post("/recipients", RecipientController.store);
routes.put("/recipients", RecipientController.update);

// Deliveryman
routes.get("/deliveryman", DeliverymanController.index);
routes.post("/deliveryman", DeliverymanController.store);
routes.put("/deliveryman/:id", DeliverymanController.update);
routes.delete("/deliveryman/:id", DeliverymanController.delete);

routes.post(
  "/avatardeliveryman",
  avatarUpload.single("avatar"),
  FileAvatarController.store
);

// Deliveries

routes.get("/delivery", DeliveryController.index);
routes.post("/delivery", DeliveryController.store);
routes.put("/delivery/:id", DeliveryController.update);
routes.delete("/delivery/:id", DeliveryController.delete);

routes.post(
  "/signature",
  signatureUpload.single("signature"),
  FileSignatureController.store
);

export default routes;
