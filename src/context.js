const db = require('./util/db');
const consts = require('./consts');
const logger =  require('./util/logger');


class Context{
    constructor(){
        
    }

    async init(config){
        this.config = config;
        this.consts = consts;
        this.logger = logger.init(config);
        const {models, sequelize} = db.init(config.mysql);
        this.models = models;
        this.sequelize = sequelize;
    }

    isTest(){
        return this.config.env == 'test';
    }

    isDev(){
        return this.config.env == 'dev';
    }

    isProduction(){
        return this.config.env == 'production';
    }

    async addArticles(datas){
        let vals = '';
        for(let item of datas){
            let {title, link, description, feed, pubTime, addTime} = item;

            if(title.includes(`'`)){
                title = title.replace(/\'/g, `\\'`);
            }

            if(description.includes(`'`)){
                description = description.replace(/\'/g, `\\'`);
            }

            vals += `('${title}','${link}','${description}','${feed}', ${pubTime}, ${addTime}),`;
        }
        vals = vals.slice(0, vals.length-1);
        let sql = `
            insert into 
            article 
                (title, link, description, feed, pubTime, addTime) 
            values 
                 ${vals} 
            ON DUPLICATE KEY UPDATE 
                title =  VALUES(title),
                description =  VALUES(description),
                feed =  VALUES(feed),
                pubTime =  VALUES(pubTime),
                addTime =  VALUES(addTime)
            ;
            `;
        try{
            const [results, metadata] = await this.sequelize.query(sql);
            return 1;
        }catch(err){
            this.logger.error('addArticles failed', err, sql, JSON.stringify(datas));
            return 0;
        }
    }

    async addJobStatis(name, id, ts){
        let addData = {
            name: name,
            jid: id,
            activate_time: ts
        }
        try{
            const statis = await ctx.models.job_statis_copy.create(addData);
        }catch(err){
            this.logger.error('addJobStatis', err, JSON.stringify(addData));
            return 0;
        }
    }

    async upJobStatis(name, id, ts){
        let upData = {
            name: name,
            jid: id,
            complete_time: ts,
            complete: 1
        }
        let where = {
            name: name,
            jid: id
        }
        try{
            const [results, metadata] = await ctx.models.job_statis_copy.update(upData, {where: where});
        }catch(err){
            this.logger.error('upJobStatis', err, JSON.stringify(upData));
        }
    }
}

let ctx = new Context();

module.exports = ctx;