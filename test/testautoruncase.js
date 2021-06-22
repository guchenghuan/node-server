var exec = require("child_process").exec;

return new Promise((res, rej) => {
    // var cmdStr = 'node app\\testcase\\play-pause.js'  // 播放暂停
    var cmdStr = 'node app\\testcase\\play-pause.js'  // 切换时间  
    // var cmdStr = 'node app\\testcase\\testselenium.js'  // test selenium
    console.log('start run')
    exec(cmdStr, function (err, stdout, stderr) {
        if (err) {
            console.log('not ok:' + stderr);
        } else {
            console.log('success done');
            console.log('stdout: ', stdout)
        }
    });
})