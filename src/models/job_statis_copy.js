const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return job_statis_copy.init(sequelize, DataTypes);
}

class job_statis_copy extends Sequelize.Model {
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
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    complete_time: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    complete: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'job_statis_copy',
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
  return job_statis_copy;
  }
}
