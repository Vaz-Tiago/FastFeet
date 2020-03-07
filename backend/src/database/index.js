import Sequelize from "sequelize";

import User from "../app/models/User";
import Recipient from "../app/models/Recipient";
import FileAvatar from "../app/models/FileAvatar";
import Deliveryman from "../app/models/Deliveryman";
import FileSignature from "../app/models/FileSignature";
import Delivery from "../app/models/Delivery";
import DeliveryProblem from "../app/models/DeliveryProblem";

import databaseConfig from "../config/database";

const models = [
  User,
  Recipient,
  FileAvatar,
  Deliveryman,
  FileSignature,
  Delivery,
  DeliveryProblem
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
