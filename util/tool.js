const escape_html = require('escape-html');

exports.escape = function(str){
    // return escape_html(str);
    return str = str.replace('&', '&amp;');
}