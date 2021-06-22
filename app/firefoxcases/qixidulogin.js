// 清晰度切换

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
        // 对清晰度进行操作 不换醒登录框
        let buttonqixidu = await driver.wait(until.elementLocated(By.className('bilibili-player-video-btn-quality')), 2000);
        const actions = driver.actions({ bridge: true });
        actions.move({ origin: buttonqixidu }).perform();
        await driver.sleep(2000)
        const list = await driver.findElements({ className: 'bui-select-item' })
        await list[1].click()
        await driver.sleep(1000)
        let buttonlogin = await driver.wait(until.elementLocated(By.className('bili-mini')), 2000);
        if (buttonlogin) {
            const owncase = `
            获取页面元素 page.$('.bilibili-player-video-btn-quality'); 
            执行 click 事件
            获取页面元素组 page.$('.bui-select-item'); 
            对list第三个480p 执行 click 事件
            waitfor login iframe 
            断言取值：document.querySelector('.bili-mini')
            ` + '结果为： true'
            console.log(owncase)
        } else {
            console.log('实际值与预期值不符，登录框未弹出...')
        }
        await driver.sleep(1000)
        await driver.quit();
    } catch (e) {
        await driver.quit();
        console.log('执行失败 error: ', e)
    }
})()