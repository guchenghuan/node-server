// 画中画

const { Builder, By, Key, until } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const ie = require('selenium-webdriver/ie');
const iedriver = require('iedriver');   //If this driver is already on your system, then no need to install using npm.

let options = new ie.Options()
    .addArguments('-headless')

var driver = new webdriver.Builder()
    .setIeOptions(options)
    .forBrowser('internet explorer')
    .build();

(async function () {  // https://www.bilibili.com/video/BV1154y1m7j1
    try {
        await driver.get('https://www.bilibili.com/video/BV1154y1m7j1')
        // await driver.manage().window().maximize();
        await driver.sleep(10000)
        const results = await driver.executeScript(function () {
            var result = window.player.getPlayerState().pipMode
            return result
        })
        if (results) {
            const owncase = `
            获取页面元素 page.$('.bilibili-player-iconfont-pip-on'); 
            执行 click 事件
            断言取值：player.getPlayerState().pipMode
            ` + '结果为： ' + results
            console.log(owncase)
        } else {
            console.log('实际值与预期值不符，实际值为：', results, ' 请检查原因')
        }
        await driver.sleep(1000)
        await driver.quit();
    } catch (e) {
        await driver.quit();
        console.log('执行失败 error: ', e)
    }
})()