'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      detail_transaksi.belongsTo(models.transaksi, {
        foreignKey: 'transaksi_id',
        as: 'transaksi'
      });
      
      detail_transaksi.belongsTo(models.menu, {
        foreignKey: 'menu_id',
        as: 'menu'
      });
    }
  }
  detail_transaksi.init({
    detail_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    transaksi_id: DataTypes.INTEGER,
    menu_id: DataTypes.INTEGER,
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail_transaksi',
  });
  return detail_transaksi;
};