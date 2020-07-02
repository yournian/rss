const File = require('./myFile');
const logger = require('./logger').getLogger();
const request = require('superagent');

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
        logger.debug('====html download====');
        return new Promise((resolve, reject) => {
            request.get(url, async (err, res) => {
                if (err) {
                    logger.error('download failed: errmsg[%s], url[%s] ', err.message, url);
                    resolve(null);
                }else{
                    if(res.statusCode == 200){
                        logger.info('download scuueed: url[%s]', url);
                        resolve(new Html(url, res.body));
                    }else{
                        logger.warn('download unsuccessful, statusCode[%s], statusMessage[%s], url[%s] ', response.statusCode, response.statusMessage, url);
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