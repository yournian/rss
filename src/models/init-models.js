var DataTypes = require("sequelize").DataTypes;
var _article = require("./article");
var _crontabs = require("./crontabs");
var _job_statis = require("./job_statis");
var _job_statis_copy = require("./job_statis_copy");

function initModels(sequelize) {
  var article = _article(sequelize, DataTypes);
  var crontabs = _crontabs(sequelize, DataTypes);
  var job_statis = _job_statis(sequelize, DataTypes);
  var job_statis_copy = _job_statis_copy(sequelize, DataTypes);


  return {
    article,
    crontabs,
    job_statis,
    job_statis_copy,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
