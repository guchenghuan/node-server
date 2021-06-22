// 弹幕设置 弹幕速度

const { Builder, By, Key, until } = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

let options = new firefox.Options()
    .setProfile('C:\\Users\\guchenghuan\\AppData\\Local\\Mozilla\\Firefox\\Profiles')
    .setBinary('C:\\Program Files\\Mozilla Firefox\\firefox.exe')
    .addArguments('-headless')
let driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

(async function () {  // https://www.bilibili.com/video/BV1154y1m7j1
    try {
        await driver.get('https://www.bilibili.com/video/BV1154y1m7j1')
        // await driver.manage().window().maximize();
        await driver.sleep(5000)
        let button = await driver.wait(until.elementLocated(By.className('bilibili-player-video-danmaku-setting')), 2000);
        const actions = driver.actions({ bridge: true });
        actions.move({ origin: button }).perform();
        await driver.sleep(1000)
        let buttonsecai1 = await driver.findElement({ className: 'bilibili-player-video-danmaku-setting-left-speedplus' })
        await buttonsecai1.click()
        await driver.sleep(2000)
        const results = await driver.executeScript(function () {
            //调用JavaScript获取当前视频时长
            const data1 = localStorage.getItem('bilibili_player_settings');
            var data = JSON.parse(data1);
            var result = data.setting_config.speedplus;
            return result
        })
        if (results === 0.826) {
            const owncase = `
            获取页面元素 page.$('.bilibili-player-video-danmaku-setting'); 
            执行 hover 事件
            获取页面元素 page.$('.bilibili-player-video-danmaku-setting-left-block-content'); 
            进行 boundingBox 块级元素坐标获取
            执行 mouse.click(x, y) 事件 
            断言取值：localStorage.bilibili_player_settings.setting_config.speedplus;
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