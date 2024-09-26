"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaksi.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user", // Alias untuk akses relasi
      });

      transaksi.belongsTo(models.meja, {
        foreignKey: "meja_id",
        as: "meja",
      });

      transaksi.hasMany(models.detail_transaksi, {
        foreignKey: "transaksi_id",
        as: "detailTransaksi",
      });
    }
  }
  transaksi.init(
    {
      transaksi_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      tgl_transaksi: DataTypes.DATE,
      user_id: DataTypes.INTEGER,
      meja_id: DataTypes.INTEGER,
      nama_pelanggan: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("pending", "success"), // Mendefinisikan nilai-nilai ENUM
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "transaksi",
    }
  );
  return transaksi;
};
