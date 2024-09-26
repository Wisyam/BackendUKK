'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      menu.hasMany(models.detail_transaksi, {
        foreignKey: 'menu_id',
        as: 'detailTransaksi'
      });
    }
  }
  menu.init({
    menu_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama_menu: DataTypes.STRING,
    jenis: {
      type: DataTypes.ENUM('makanan', 'minuman'),
      allowNull: false
    },
    deskripsi: DataTypes.STRING,
    gambar: DataTypes.STRING,
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'menu',
  });
  return menu;
};