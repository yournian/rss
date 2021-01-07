const {escape} = require('../util/tool');
const fs = require("fs");

let s = 'Genius in Action & Kim Dong & Moon - aa -bb';
let content = escape(s);
console.log(content);

// fs.writeFile('escape', content, (err) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log('done');
//     }
// });

