const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return job_statis.init(sequelize, DataTypes);
}

class job_statis extends Sequelize.Model {
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
    jid: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    activate_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    complete_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    complete: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'job_statis',
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
  return job_statis;
  }
}
