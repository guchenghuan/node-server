// 弹幕设置 字体大小
// 弹幕设置 智能云屏蔽

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
        let button = await driver.wait(until.elementLocated(By.className('bilibili-player-video-danmaku-setting')), 2000);
        const actions = driver.actions({ bridge: true });
        actions.move({ origin: button }).perform();
        await driver.sleep(1000)
        let buttonsecai1 = await driver.findElement({ className: 'bilibili-player-video-danmaku-setting-left-fontsize' })
        await buttonsecai1.click()
        await driver.sleep(2000)
        const results = await driver.executeScript(function () {
            //调用JavaScript获取当前视频时长
            const data1 = localStorage.getItem('bilibili_player_settings');
            var data = JSON.parse(data1);
            var result = data.setting_config.fontsize;
            return result
        })
        if (results === 0.826) {
            const owncase = `
            获取页面元素 page.$('.bilibili-player-video-danmaku-setting'); 
            执行 hover 事件
            获取页面元素 page.$('.bilibili-player-video-danmaku-setting-left-block-content'); 
            进行 boundingBox 块级元素坐标获取
            执行 mouse.click(x, y) 事件 
            断言取值：localStorage.bilibili_player_settings.setting_config.fontsize;
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