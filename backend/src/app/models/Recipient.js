import Sequelize, { Model } from "sequelize";

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        adress: Sequelize.STRING,
        number: Sequelize.STRING,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zipcode: Sequelize.INTEGER
      },
      { sequelize }
    );
    return this;
  }
}

export default Recipient;
