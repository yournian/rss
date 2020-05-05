const fs = require("fs");

class File{
    constructor(){

    }

    isExist(name){
        return new Promise((resolve, reject) => {
            fs.exists(name, (exists) => {
                resolve(exists);
            });
        })
    }

    save(name, content){
        return new Promise((resolve, reject) => {
            fs.writeFile(name, content, (err) => {
                if(err) {
                    console.error('写入失败: ', err);
                    reject();
                } else {
                    console.debug('写入成功');
                    resolve();
                }
            });
        })
    }

    read(name){
        return new Promise((resolve, reject) => {
            fs.readFile(name, {flag: 'r', encoding: 'utf8'}, function (err, data) {
                if(err) {
                    console.error('读取文件失败: ', err);
                    reject();
                }else{
                    console.log('读取文件成功');
                    resolve(data);
                }
            });
        })
    }

    getSize(name){
        try{
            let stats = fs.statSync(name);
            return stats.size;
        }catch(err){
            console.error('getSize failed: ', err);
        }
    }
}

module.exports = File;