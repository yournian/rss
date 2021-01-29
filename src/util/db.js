const { Sequelize, Model, DataTypes } = require("sequelize");
const initModels = require("../models/init-models");

function init(config){
    let {database, host, port, user, password} = config;
    const sequelize = new Sequelize(database, user, password, {
        host: host,
        dialect: 'mysql'
    });
    const models = initModels(sequelize);
    return {models, sequelize};
}

module.exports = {
    init
};
