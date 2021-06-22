// 右键-色彩调整
const { Builder, By, Key, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');
const edgedriver = require('msedgedriver');   //If this driver is already on your system, then no need to install using npm.

(async function () {  // https://www.bilibili.com/video/BV1154y1m7j1
    try {
        let options = new edge.Options()
            .addArguments('-headless')
        let service = await new edge.ServiceBuilder(edgedriver.path);
        let driver = await new Builder()
            .forBrowser('MicrosoftEdge')
            .setEdgeOptions(options)
            .setEdgeService(service).build();

        await driver.get('https://www.bilibili.com/video/BV1154y1m7j1')
        // await driver.manage().window().maximize();
        await driver.sleep(5000)
        const actions = driver.actions({ bridge: true });
        await driver.sleep(2000)
        let button = await driver.wait(until.elementLocated(By.className('bilibili-player-video-top')), 2000);
        actions.contextClick(button).perform();
        await driver.sleep(2000)
        const list = await driver.findElements({ className: 'context-line' })
        await list[0].click()
        let buttonsecai1 = await driver.wait(until.elementLocated(By.className('bilibili-player-color-panel-saturate')), 2000);
        await buttonsecai1.click()
        await driver.sleep(1000)
        let buttonsecai2 = await driver.wait(until.elementLocated(By.className('bilibili-player-color-panel-brightness')), 2000);
        await buttonsecai2.click()
        await driver.sleep(1000)
        let buttonsecai3 = await driver.wait(until.elementLocated(By.className('bilibili-player-color-panel-contrast')), 2000);
        await buttonsecai3.click()
        await driver.sleep(2000)
        const results = await driver.executeScript(function () {
            var result = window.player.getPlayerState().colorEffect.brightness
            return result
        })
        if (results !== 100) {
            const owncase = `
            获取页面元素 page.$('.bilibili-player-video-btn-quality'); 
            执行 hover 事件
            获取页面元素 page.$('.bilibili-player-color-panel-reset'); 
            执行 click 事件 
            断言取值：player.getPlayerState().colorEffect.brightness
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