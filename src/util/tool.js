const escape_html = require('escape-html');

exports.escape = function(str){
    return escape_html(str);
}

exports.isEmpty = function(target){
    if(target === null || target === undefined) return true;

    if(Array.isArray(target)){
        return target.length == 0;
    }

    if(Object.prototype.toString.call(target) == '[object Object]' ){
        return Object.keys(target).length == 0;
    }

    return false;
}