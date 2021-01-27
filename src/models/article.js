const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return article.init(sequelize, DataTypes);
}

class article extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    feed: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pubTime: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    addTime: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'article',
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
      {
        name: "title",
        using: "BTREE",
        fields: [
          { name: "title" },
        ]
      },
    ]
  });
  return article;
  }
}
