const {DomainName, Path } = require('../consts');

function getFeedPath(name){
    return  Path.feed + name + '.xml'
}

function getFeedHref(name){
    return DomainName + 'youtube/feed/' + name + '.xml'
}

function getAudioPath(name){
    return DomainName + 'youtube/media/' + name;
}

module.exports = {
    getFeedPath,
    getFeedHref,
    getAudioPath
}