import Sequelize, { Model } from 'sequelize';

class Deliveryman extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING
      },
      {
        sequelize,
        tableName: 'deliverymen'
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.FileAvatar, {
      foreignKey: 'avatar_id',
      as: 'avatar'
    });
  }
}

export default Deliveryman;
