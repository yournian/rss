const crypto = require('crypto');

function md5(raw){
    let md5 = crypto.createHash('md5');
    let result = md5.update(raw).digest('hex');
    return result;
}

module.exports = {
    md5
}