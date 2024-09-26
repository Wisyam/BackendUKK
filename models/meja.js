'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class meja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      meja.hasMany(models.transaksi, {
        foreignKey: 'meja_id',
        as: 'transaksi'
      });
    }
  }
  meja.init({
    meja_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nomor_meja: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'meja',
  });
  return meja;
};