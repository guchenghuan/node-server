const webdriverio = require('webdriverio');

//设置被测应用参数
let options = {
    hostname: '0.0.0.0',
    port: 4723,
    logLevel: 'info',
    capabilities: {
        // automationName: 'uiautomator2',
        platformName: 'android',
        deviceName: "79c7cc4c", //设备序列串号 
        // platformVersion: "5.1.1", //系统平台版本/
        resetKeyboard: true,
        noReset: true,
        unicodeKeyboard: true,
        appPackage: "tv.danmaku.bili", //package 名字
        appActivity: "tv.danmaku.bili.ui.splash.SplashActivity", //启动activity 名字
    },
}
//根据参数配置创建WebDriverIO实例;
var client;

async function createDriver() {
    client = await webdriverio.remote(options);
    return client;
}

function getDriver() {
    return client;
}

exports.createDriver = createDriver;
exports.getDriver = getDriver;

