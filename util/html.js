const File = require('./myFile');
const logger = require('./logger').getLogger();
const request = require('superagent');
const iconv = require("iconv-lite");


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

    decode(buffer, encoding){
        if(!Buffer.isBuffer(buffer)) return;
        if(!encoding) encoding = 'utf-8';
        return iconv.decode(buffer, encoding);;
    }

    isEmpty(content){
        return !content || Object.keys(content).length == 0;
    }

    async download(url, encoding){
        logger.debug('====html download====');
        return new Promise((resolve, reject) => {
            request.get(url, async (err, res) => {
                if (err) {
                    logger.error('download failed: errmsg[%s], url[%s] ', err.message, url);
                    resolve(null);
                }else{
                    if(res.statusCode == 200){
                        logger.info('download scuueed: url[%s]', url);
                        let content = this.isEmpty(res.body) ? res.text : res.body;
                        content = this.decode(content, encoding);
                        resolve(new Html(url, content));
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