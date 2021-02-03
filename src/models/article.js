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
    link: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      unique: "link"
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
    },
    feed: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
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
        name: "link",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "link" },
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
