const ctx = require('../src/context');
const {models, sequelize} = ctx;


async function sel(){
    const crons = await models.crontabs.findAll({where: {enable: 1}});
    console.log(crons.length);
    // console.log(crons);

}
async function main(){
    await rawInsert();
}


async function rawInsert(){
    let pubTime = new Date().getTime();
    let addTime = new Date().getTime();

    let sql = `
        insert into 
        article 
            (title, link, description, pubTime, addTime) 
        values 
            ('title4_1', 'link4', 'desc4', ${pubTime}, ${addTime}), 
            ('title5', 'link5', 'desc5', ${pubTime}, ${addTime}) 
        ON DUPLICATE KEY UPDATE 
            title =  VALUES(title),
            description =  VALUES(description),
            pubTime =  VALUES(pubTime),
            addTime =  VALUES(addTime)
        ;
        `;
    const [results, metadata] = await sequelize.query(sql);
    console.log(results);
    console.log(metadata);

}

module.exports = main;