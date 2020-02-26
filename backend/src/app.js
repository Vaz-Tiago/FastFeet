import "dotenv/config";

import express from "express";
import path from "path";
import routes from "./routes";
import "./database";

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());

    this.server.use(
      "/files/avatar",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads", "avatar"))
    );

    this.server.use(
      "/files/signature",
      express.static(
        path.resolve(__dirname, "..", "tmp", "uploads", "signature")
      )
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
