const schedule = require('node-schedule');

// 间隔重复执行
// var j = schedule.scheduleJob('01 * * * * *', function(){
//     console.log('runs at every minute at second 01');
//   });

// // 定时执行
// var j2 = schedule.scheduleJob(date, function(){
//   console.log('The job run at ', date);
// });

function repeat(format, fn){
    // *    *    *    *    *    *
    // ┬    ┬    ┬    ┬    ┬    ┬
    // │    │    │    │    │    │
    // │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    // │    │    │    │    └───── month (1 - 12)
    // │    │    │    └────────── day of month (1 - 31)
    // │    │    └─────────────── hour (0 - 23)
    // │    └──────────────────── minute (0 - 59)
    // └───────────────────────── second (0 - 59, OPTIONAL)
    // let {second, minute, hour, dayOfMonth, month,  dayOfWeek} = data;
    // let fotmats = [];
    return schedule.scheduleJob(format, fn); 
}


function future(date, fn){
    if(data <= new Date()){
        return false;
    }else{
        return schedule.scheduleJob(date, fn);
    }
}

module.exports = {
    future,
    repeat
}