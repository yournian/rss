const schedule = require('../util/schedule');

function repeat(){
    let sum = 0;
    function print(){
        console.log(new Date());
    }
    schedule.repeat('*/2 * * * *', print);
}
repeat();