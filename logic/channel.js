// const prefix = 'https://rsshub.app/youtube/channel/';
const prefix = 'http://yournian/feed/';


class Channel{
    constructor(id, title, link, description){
        this.id = id;
        this.title= title;
        this.link = link;
        this.description = description;
    }

    getFeedUrl(){
        return prefix + this.id + 'xml';
    }
}

module.exports = Channel;