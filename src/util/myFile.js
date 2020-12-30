const fs = require("fs");

class File{
    constructor(){

    }

    isExist(name){
        return new Promise((resolve, reject) => {
            fs.stat(name, (err, stats) => {
                if(err){
                    resolve(false);
                }else{
                    resolve(true);
                }
            });
        })
    }

    isExistSync(path){
        return fs.existsSync(path);
    }

    save(name, content){
        return new Promise((resolve, reject) => {
            fs.writeFile(name, content, (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }

    read(name){
        return new Promise((resolve, reject) => {
            fs.readFile(name, {flag: 'r', encoding: 'utf8'}, function (err, data) {
                if(err) {
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        })
    }

    getSize(name){
        let stats = fs.statSync(name);
        return stats.size;
    }
}

module.exports = File;