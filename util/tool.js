const escape_html = require('escape-html');

exports.escape = function(str){
    // return escape_html(str);
    if(str.includes('-')){
        console.log('-', str);
    }
    if(str.includes('^S')){
        console.log('^S:', str);
    }
    str = str.replace(/&/g, '&amp;').replace(/\-/g, ':');
    return str;
}