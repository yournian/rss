const {md5} = require('../util/crypto');
const expect = require('chai').expect;


// describe('crypto', () => {
//     it('md5', () => {
//         // let result = md5('123456');
//         let result = md5('http://www.x3cn.com/forum.php?mod=rss&fid=67');
//         console.log(result.slice(10));
//         expect(result.toUpperCase()).to.be.equal('E10ADC3949BA59ABBE56E057F20F883E');
//     })
// })

let raw = 'http://www.x3cn.com/forum.php?mod=rss&fid=111';
let result = md5(raw);
let salt = result.slice(0, 10);
raw += salt;
result =  md5(raw);
console.log(result.slice(0, 10));