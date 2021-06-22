// 右键-音效调节 重置

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
        const actions = driver.actions({ bridge: true });
        await driver.sleep(2000)
        let button = await driver.wait(until.elementLocated(By.className('bilibili-player-video-top')), 2000);
        actions.contextClick(button).perform();
        await driver.sleep(2000)
        const list = await driver.findElements({ className: 'context-line' })
        await list[1].click()
        await driver.sleep(1000)
        let buttonsecai1 = await driver.findElements({ className: 'bl-audio-panel-preset-btn' })
        await buttonsecai1[4].click()
        await driver.sleep(1000)
        let buttonsecai2 = await driver.findElement({ className: 'bl-audio-panel-left-gain' })
        await buttonsecai2.click()
        await driver.sleep(1000)
        let buttonsecai3 = await driver.findElement({ className: 'bl-audio-panel-left-reset' })
        await buttonsecai3.click()
        await driver.sleep(2000)
        const results = await driver.executeScript(function () {
            var result = window.player.getPlayerState().audioEffect.gain
            return result
        })
        if (results === 0) {
            const owncase = `
            获取页面元素 page.$('.bilibili-player-context-menu-origin'); 
            执行 hover 事件
            获取页面元素 page.$('.bl-audio-panel-left'); 
            执行 click 事件
            断言取值：player.getPlayerState().audioEffect.gain
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