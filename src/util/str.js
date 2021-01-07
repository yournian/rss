const { v4 }  = require('uuid') ;


class Str{
    constructor(){

    }

    randomStr(length){
        let rand = v4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        if(length >0 && length < 37){
            rand.slice(0, length);
        }else{
            return rand;
        }
    }
}

module.exports = Str;