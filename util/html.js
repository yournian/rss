const logger = require('log4js').getLogger();
const request = require('request');
const File = require('./myFile');

class Html{
    constructor(url, content){
        this.url = url;
        this.content = content;
    }

    save(name){
        new File().save(name, this.content);
    }
}

class HtmlDownloader{
    constructor(){
    }

    async download(url){
        logger.info('====download: ', url);
        return new Promise((resolve, reject) => {
            request(url, async (error, response, body) => {
                if (error) {
                    logger.error('download failed: ', error);
                    reject(error);
                }else{
                    if(response.statusCode == 200){
                        logger.info('download scuueed');
                        resolve(new Html(url, body));
                    }else{
                        logger.warn('download unsuccessful, code: ', response.statusCod);
                        resolve(null);
                    }
                }
            })
        })
        
    }
}

module.exports = {
    Html,
    HtmlDownloader
};