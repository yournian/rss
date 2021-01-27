const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return crontabs.init(sequelize, DataTypes);
}

class crontabs extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: ""
    },
    _value: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    interval: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    cron: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    enable: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    immediate: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    encoding: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    rule: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'crontabs',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return crontabs;
  }
}
