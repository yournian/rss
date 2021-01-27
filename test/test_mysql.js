let {models} = global;

async function main(){
    const crons = await models.crontabs.findAll({where: {enable: 1}});
    console.log(crons.length);
    // console.log(crons);
}


module.exports = main;