var DataTypes = require("sequelize").DataTypes;
var _article = require("./article");
var _crontabs = require("./crontabs");

function initModels(sequelize) {
  var article = _article(sequelize, DataTypes);
  var crontabs = _crontabs(sequelize, DataTypes);


  return {
    article,
    crontabs,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
